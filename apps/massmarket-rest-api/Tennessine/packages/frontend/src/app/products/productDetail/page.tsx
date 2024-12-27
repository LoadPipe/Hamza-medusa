// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

"use client";
import React, { useState, useEffect } from "react";
// import ModalHeader from "@/app/common/components/ModalHeader";
import Image from "next/image";
import Button from "@/app/common/components/Button";
// import SeeProductActions from "@/app/components/products/SeeProductActions";
import { IProduct, ItemId } from "@/types";
import { useStoreContext } from "@/context/StoreContext";
import { useRouter, useSearchParams } from "next/navigation";
import { ItemState } from "@/context/types";
import ErrorMessage from "@/app/common/components/ErrorMessage";
import Chevron from "@/app/common/components/Chevron";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/dropdown";

const ProductDetail = () => {
  const {
    products,
    updateOrder,
    orderItems,
    orderId,
    addProductToTag,
    allTags,
  } = useStoreContext();
  const router = useRouter();
  const searchParams = useSearchParams();
  const itemId = searchParams.get("itemId") as ItemId;
  const [quantity, setQuantity] = useState<number>(0);
  // const [showActions, setShowActions] = useState<boolean>(false);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [item, setItem] = useState<IProduct | null>(null);

  const [addedToCart, setAddedToCart] = useState<boolean>(false);
  const [buttonState, setButton] = useState<"Success" | "Review" | "Update">(
    "Review",
  );
  const [showErrorMessage, setShowErrorMessage] = useState<null | string>(null);
  const [available, setAvailable] = useState<number>(0);
  const dropdownOpts = Array.from({ length: available }, (_, index) => index);

  // const flyoutRef = createRef<HTMLDivElement>();

  // const handleFlyout = (event: MouseEvent) => {
  //   if (
  //     flyoutRef.current &&
  //     !flyoutRef.current.contains(event.target as Node)
  //   ) {
  //     setShowActions(false);
  //   }
  // };

  const findRemoveTagId = () => {
    for (const [key, value] of allTags.entries()) {
      if (value.text && value.text === "remove") {
        return key;
      }
    }
    setShowErrorMessage("Create a :remove tag first.");
    return null;
  };

  const handleDelete = async () => {
    const tagId = findRemoveTagId();
    const res = tagId ? await addProductToTag(tagId, itemId) : null;
    if (!res || res.error) {
      setShowErrorMessage(
        res?.error || "There was an error removing tag from Item.",
      );
    } else {
      console.log("successfully removed item");
      router.push("/products");
    }
  };

  // useEffect(() => {
  //   document.addEventListener("mousedown", (event: MouseEvent) =>
  //     handleFlyout(event),
  //   );
  //   return () => {
  //     document.removeEventListener("mousedown", (event: MouseEvent) =>
  //       handleFlyout(event),
  //     );
  //   };
  // }, [flyoutRef]);

  useEffect(() => {
    const itemsInCurrentCart: ItemState | null =
      (orderId && orderItems.get(orderId)?.items) || null;
    if (itemId && itemsInCurrentCart?.[itemId]) {
      setAddedToCart(true);
    }
  }, [orderItems, item]);

  useEffect(() => {
    if (itemId) {
      const _item = products.get(itemId);
      _item && setItem(_item);
      _item && setAvailable(_item?.stockQty || 0);
      const qty =
        _item && orderId ? orderItems.get(orderId)?.items?.[itemId] || 0 : 0;
      setQuantity(qty);
    }
  }, [itemId]);

  const confirmDelete = (
    <div
      id="confirm-modal-container"
      className="absolute h-4/6 w-full flex justify-center items-center"
    >
      <div
        id="confirm-modal"
        className="w-72 h-64 bg-white text-center px-6 py-2 flex items-center justify-center rounded-2xl flex-col border"
      >
        <p>Are you sure you want to remove this product from your store?</p>
        <div id="buttons" className="flex text-sm gap-2 mt-4">
          <button
            className="border-4 p-2 rounded-lg"
            onClick={() => setShowConfirmModal(false)}
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="bg-blue-900 p-3 text-white rounded-lg"
          >
            Im sure
          </button>
        </div>
      </div>
    </div>
  );

  if (!item) return null;

  const getCtaButton = () => {
    if (!addedToCart) {
      return (
        <Button
          disabled={!quantity}
          onClick={async () => {
            const res = await updateOrder(item.id, quantity);
            if (res?.error) {
              setShowErrorMessage(res.error);
            } else {
              setButton("Review");
            }
          }}
        >
          {(Number(item.price) * quantity).toFixed(2)}
        </Button>
      );
    } else if (buttonState === "Review") {
      return (
        <Button onClick={() => router.push("/checkout")}>Review Sale</Button>
      );
    } else
      return (
        <Button
          onClick={async () => {
            const res = await updateOrder(item.id, quantity);
            if (res?.error) {
              setShowErrorMessage(res.error);
            } else {
              setButton("Review");
            }
          }}
        >
          Update Sale
        </Button>
      );
  };

  return (
    <main className="pt-under-nav h-screen bg-gray-100">
      {showConfirmModal && confirmDelete}
      {/* <ModalHeader /> */}
      <section className="h-[45rem] flex flex-col">
        <ErrorMessage
          errorMessage={showErrorMessage}
          onClose={() => {
            setShowErrorMessage(null);
            router.push("/products");
          }}
        />
        <div className="m-4">
          <div className="flex">
            {item.metadata.image && (
              <Image
                // src="/assets/example-item.jpeg"
                src={item.metadata.image}
                alt="product-detail-image"
                width={136}
                height={136}
                className="border rounded-lg"
                unoptimized={true}
                style={{ maxHeight: "136px", maxWidth: "136px" }}
              />
            )}
            <div className="flex flex-col">
              <h2 className="text-xl flex items-center pl-4">
                {item.metadata.name}
              </h2>
              <p className=" text-xs flex items-center pl-4">
                {item.metadata.description}
              </p>
            </div>
          </div>
          <section className="flex gap-4 flex-col">
            <div>
              <h5 className="font-sans text-gray-700 my-4">Product Details</h5>
              <div className="flex justify-between py-4 bg-white border rounded-lg p-4">
                <p>Price</p>
                <p>{item.price} usdc</p>
              </div>
            </div>
            <div>
              <h5 className="font-sans  text-gray-700 my-4">
                Inventory Details
              </h5>
              <div className="flex justify-between py-4 bg-white border rounded-lg p-4">
                <p>Available</p>
                <p>{available}</p>
              </div>
            </div>
            <section className="flex gap-2">
              <div>
                <h5 className="text-xs text-primary-gray mb-2">Quantity</h5>
                <Dropdown>
                  <DropdownTrigger>
                    <Button>
                      <div className="flex gap-2 p-4 border-2 rounded-xl text-2xl">
                        {quantity}
                        <Chevron hex="black" />
                      </div>
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu className="bg-white">
                    {dropdownOpts.map((a) => {
                      return (
                        <DropdownItem key={a} onClick={() => setQuantity(a)}>
                          {a}
                        </DropdownItem>
                      );
                    })}
                  </DropdownMenu>
                </Dropdown>
              </div>
              <div>
                <h5 className="text-xs text-primary-gray mb-2">
                  Add to basket
                </h5>
                <div>{getCtaButton()}</div>
              </div>
            </section>
          </section>
        </div>

        {/* <div className="mt-auto bg-white p-4 pb-8 rounded-2xl border border-gray-200">
          <div className="flex my-5">
            <div className="flex flex-col mr-auto">
              <p>total</p>
              <p className="text-xs text-gray-500">{quantity} items</p>
            </div>
            <p>{(Number(item.price) * quantity).toFixed(2)} USDC</p>
          </div>
          <div>{getCtaButton()}</div>
        </div> */}
      </section>
    </main>
  );
};
export default ProductDetail;
