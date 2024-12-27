// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

"use client";

import React, {
  useReducer,
  ChangeEvent,
  useRef,
  useState,
  useEffect,
} from "react";
import Image from "next/image";
import {
  EDIT_PRICE,
  EDIT_TITLE,
  EDIT_UNIT,
  UPLOAD_IMG,
  EDIT_IMG,
  newProductReducer,
  initialState,
  newProductActions,
  EDIT_DESC,
} from "@/reducers/productReducers";
import { SELECT_TAG, selectedTagReducer } from "@/reducers/tagReducers";
import { useStoreContext } from "@/context/StoreContext";
import ProductsTags from "@/app/components/products/ProductTags";
import { useRouter, useSearchParams } from "next/navigation";
import { IProduct, ITag, ItemId, TagId } from "@/types";
import ErrorMessage from "@/app/common/components/ErrorMessage";
import VisibilitySlider from "@/app/components/products/VisibilitySlider";
import SecondaryButton from "@/app/common/components/SecondaryButton";

const AddProductView = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const itemId = searchParams.get("itemId") as ItemId | "new";
  const editView = itemId !== "new";
  const { addProduct, updateProduct, allTags, products } = useStoreContext();
  const productInView = editView ? products.get(itemId) : null;
  const [img, setImg] = useState<string>(productInView?.metadata?.image || "");
  const [price, setPrice] = useState<string>(productInView?.price || "");
  const [title, setTitle] = useState<string>(
    productInView?.metadata?.name || "",
  );
  const [description, setDescription] = useState<string>(
    productInView?.metadata?.description || "",
  );
  const [stockQty, setStockQty] = useState(productInView?.stockQty || "0");
  const [editedPrice, setEditedPrice] = useState(false);
  const [editedMetaData, setEditedMetadata] = useState(false);
  const [editedUnit, setEditedUnit] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const [selectedTags, selectedTagsDispatch] = useReducer(
    selectedTagReducer,
    new Map(),
  );
  const _initialState =
    editView && productInView
      ? {
          id: productInView.id,
          price: price,
          stockQty: Number(stockQty),
          blob: null,
          tagIds: productInView.tagIds,
          metadata: productInView.metadata,
        }
      : initialState;
  const [newProduct, updateNewProduct] = useReducer<
    (state: IProduct, actions: newProductActions) => IProduct
  >(newProductReducer, _initialState);

  useEffect(() => {
    if (!productInView?.tagIds) return;

    productInView.tagIds.map((id) => {
      const t = allTags.get(id) as ITag;
      if (!t) return null;
      selectedTagsDispatch({ type: SELECT_TAG, payload: { selectedTag: t } });
    });
  }, [productInView?.tagIds]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const hed = editView && productInView ? "Edit product" : "Add Product";

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const onBack = () => {
    router.push(`/products`);
  };
  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    checkIfMetadata();
    try {
      const fileInput = e.target;
      if (fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();
        const blob = new FormData();
        blob.append("file", fileInput.files[0]);

        reader.onload = function (e) {
          const r = e.target as FileReader;
          const url = r.result;
          typeof url == "string" && setImg(url);
          updateNewProduct({
            type: UPLOAD_IMG,
            payload: { blob },
          });
          typeof url == "string" &&
            updateNewProduct({
              type: EDIT_IMG,
              payload: { img: url },
            });
        };

        reader.readAsDataURL(fileInput.files[0]);
        //manually reset value for subsequent uploads in the same session.
        e.target.value = "";
      }
    } catch (error) {
      console.error(error);
    }
  };

  const removeImg = () => {
    setImg("");
    updateNewProduct({
      type: EDIT_IMG,
      payload: { img: "" },
    });
    updateNewProduct({
      type: UPLOAD_IMG,
      payload: { blob: null },
    });
  };

  const onPublish = async () => {
    if (!price) {
      setError("Product must include price.");
    } else if (!title) {
      setError("Product must include title.");
    } else if (!img) {
      setError("Product must include image.");
    } else if (productInView && !productInView.id) {
      setError("Product id is missing.");
    } else {
      const changedFields = {
        price: editedPrice,
        metadata: editedMetaData,
        stockQty: editedUnit,
      };
      const selectedTagKeys: TagId[] | [] = selectedTags.size
        ? Array.from([...selectedTags.keys()])
        : [];
      const res =
        editView && productInView
          ? await updateProduct(
              productInView.id,
              changedFields,
              newProduct,
              selectedTagKeys,
            )
          : await addProduct(newProduct, selectedTagKeys);
      if (res.error) {
        setError(res.error);
      } else {
        router.push(`/products`);
      }
    }
  };

  const checkIfMetadata = () => {
    if (editView && productInView) {
      setEditedMetadata(true);
    }
  };

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    checkIfMetadata();
    setTitle(e.target.value);
    updateNewProduct({
      type: EDIT_TITLE,
      payload: { name: e.target.value },
    });
  };
  const handleDescriptionChange = (e: ChangeEvent<HTMLInputElement>) => {
    checkIfMetadata();
    setDescription(e.target.value);
    updateNewProduct({
      type: EDIT_DESC,
      payload: { description: e.target.value },
    });
  };

  const handlePriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (editView && productInView) {
      setEditedPrice(true);
    }
    const _price = e.target.value;
    if (_price && !Number(_price)) {
      setPrice("");
    } else {
      setPrice(_price);
      updateNewProduct({
        type: EDIT_PRICE,
        payload: { price: _price },
      });
    }
  };

  const handleStockChange = (e: ChangeEvent<HTMLInputElement>) => {
    const _units = e.target.value;
    if (_units && !Number(_units)) {
      setStockQty(0);
    } else {
      setStockQty(Number(e.target.value) || 0);
      updateNewProduct({
        type: EDIT_UNIT,
        payload: { unit: Number(e.target.value) },
      });
    }
    setEditedUnit(true);
  };

  return (
    <div className="h-screen inset-0 flex items-end justify-center z-40 text-sm bg-gray-100">
      <div
        className={`bg-gray-100 rounded-2xl w-full h-full min-w-full relative pb-10`}
      >
        <div id="header" className="flex relative m-4 gap-2">
          <Image
            src={"/assets/back-button.svg"}
            width={12}
            height={12}
            alt="back-button"
            unoptimized={true}
            style={{ maxHeight: "64px", maxWidth: "64px" }}
          />
          <button onClick={onBack} className="text-primary-gray">
            back
          </button>
          <div className="flex justify-center w-full">
            <header className="pr-6">{hed}</header>
          </div>
        </div>
        {error && (
          <ErrorMessage
            errorMessage={error}
            onClose={() => {
              setError(null);
            }}
          />
        )}
        <section id="content" className="m-4">
          <div className="flex">
            <div className="flex gap-3 items-center">
              <Image
                src={"/assets/chevron-right.svg"}
                width={9}
                height={15}
                alt="chevron-right"
              />
              <h2>{hed}</h2>
            </div>
            <div className="ml-auto">
              <SecondaryButton onClick={onPublish}>
                {editView ? "update" : "publish"}
              </SecondaryButton>
            </div>
          </div>
          <section className="mt-6 flex flex-col gap-4">
            <form
              className="flex flex-col"
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <label htmlFor="title">Title</label>
              <input
                value={title}
                className="border-2 border-solid mt-1 p-3 rounded-2xl"
                id="title"
                name="title"
                onChange={(e) => handleTitleChange(e)}
              />
            </form>
            <form
              className="flex flex-col"
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <label htmlFor="description">description</label>
              <input
                value={description}
                className="border-2 border-solid mt-1 p-3 rounded-2xl"
                id="description"
                name="description"
                onChange={(e) => handleDescriptionChange(e)}
              />
            </form>
            <div className="flex flex-col">
              <p className="mb-2">Product pics</p>
              {img ? (
                <div className="p-4 bg-white border-2 border-solid rounded-2xl">
                  <div className="relative w-fit p-2 mb-2">
                    <div className="p-4 border-2 w-fit rounded-2xl">
                      <Image
                        src={img}
                        width={50}
                        height={50}
                        alt="uploaded-product-image"
                        unoptimized={true}
                        style={{ maxHeight: "64px", maxWidth: "64px" }}
                      />
                    </div>
                    <Image
                      src="/assets/circle-remove.svg"
                      width={24}
                      height={24}
                      alt="remove"
                      className="absolute top-0 right-0"
                      onClick={removeImg}
                    />
                  </div>
                  <div className="border-t border-gray-300 border-0">
                    <button onClick={removeImg}>
                      <p className="text-blue-700 mt-2">Remove</p>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-solid rounded-2xl bg-primary-gray">
                  <button
                    onClick={triggerFileInput}
                    className="p-5 w-full text-white"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Image
                        src={"/assets/upload-image.svg"}
                        width={20}
                        height={20}
                        alt="back-button"
                        unoptimized={true}
                        style={{ maxHeight: "64px", maxWidth: "64px" }}
                      />
                      <p>Upload image</p>
                      <p className="text-gray-400 text-xs ">
                        {"upload JPG or PNG <10MB"}
                      </p>
                    </div>
                  </button>
                </div>
              )}
            </div>
            <div className="flex justify-between">
              <form
                className="flex flex-col w-40"
                onSubmit={(e) => {
                  e.preventDefault();
                }}
              >
                <label htmlFor="price">price</label>
                <input
                  value={price}
                  className="border-2 border-solid mt-1 p-3 rounded-2xl"
                  id="price"
                  name="price"
                  onChange={(e) => handlePriceChange(e)}
                />
              </form>
              <form
                className="flex flex-col w-40"
                onSubmit={(e) => {
                  e.preventDefault();
                }}
              >
                <label htmlFor="units">units</label>
                <input
                  value={stockQty}
                  className="border-2 border-solid mt-1 p-3 rounded-2xl"
                  id="units"
                  name="units"
                  onChange={(e) => handleStockChange(e)}
                />
              </form>
            </div>

            <div className="hidden">
              <input
                type="file"
                ref={fileInputRef}
                className="file-input"
                accept="image/*"
                onChange={handleUpload}
              />
            </div>
            <section id="tags">
              <div className="flex mb-4">
                <p>Tags</p>
              </div>
              <ProductsTags
                selectedTags={selectedTags}
                selectedTagsDispatch={selectedTagsDispatch}
                itemId={editView ? itemId : null}
                setError={setError}
              />
            </section>
            <VisibilitySlider
              selectedTags={selectedTags}
              selectedTagsDispatch={selectedTagsDispatch}
              itemId={editView ? itemId : null}
            />
          </section>
        </section>
      </div>
    </div>
  );
};
export default AddProductView;
