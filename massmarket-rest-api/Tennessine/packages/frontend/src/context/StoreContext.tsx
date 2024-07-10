// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import React, {
  createContext,
  useContext,
  useState,
  useReducer,
  useEffect,
} from "react";
import { bytesToHex } from "viem";

import { IProduct, TagId, ItemId, IStatus, IRelay } from "@/types";
import { useMyContext } from "./MyContext";
import {
  StoreContent,
  ProductsMap,
  TagsMap,
  OrdersMap,
  OrderId,
} from "@/context/types";
import {
  productReducer,
  ADD_PRODUCT,
  UPDATE_PRODUCT,
  ADD_PRODUCT_TAGS,
  REMOVE_PRODUCT_TAG,
  SET_PRODUCTS,
  UPDATE_PRICE,
  UPDATE_METADATA,
  UPDATE_STOCKQTY,
} from "@/reducers/productReducers";
import { allTagsReducer, ADD_TAG, SET_ALL_TAGS } from "@/reducers/tagReducers";
import { buildState } from "@/utils/buildState";
import {
  CLEAR_ORDER,
  REMOVE_ORDER_ITEM,
  UPDATE_ORDER_ITEM,
  UPDATE_ORDER_STATUS,
  SET_ALL_ORDER_ITEMS,
  orderReducer,
  OrderState,
} from "@/reducers/orderReducers";
import { finalizedOrderReducer } from "@/reducers/finalizedOrderReducers";
import { initialStoreContext } from "../context/initialLoadingState";
import { dummyRelays } from "./dummyData";
import { pubKeyReducer } from "@/reducers/KCPubKeysReducers";
import { setMapData, getParsedMapData, setItem, getItem } from "@/utils/level";
import { storeReducer, SET_STORE_DATA } from "@/reducers/storeReducer";

// @ts-expect-error FIXME
export const StoreContext = createContext<StoreContent>(initialStoreContext);

export const StoreContextProvider = (
  props: React.HTMLAttributes<HTMLDivElement>,
) => {
  const [orderItems, setOrderItems] = useReducer(orderReducer, new Map());
  const [products, setProducts] = useReducer(productReducer, new Map());
  const [allTags, setAllTags] = useReducer(allTagsReducer, new Map());
  const [orderId, setOrderId] = useState<OrderId | null>(null);
  const [erc20Addr, setErc20Addr] = useState<null | `0x${string}`>(null);
  const [publishedTagId, setPublishedTagId] = useState<null | TagId>(null);
  const [finalizedOrders, setFinalizedOrders] = useReducer(
    finalizedOrderReducer,
    new Map(),
  );
  const [storeData, setStoreData] = useReducer(storeReducer, {
    name: "",
    profilePictureUrl: "",
  });
  const [pubKeys, setPubKeys] = useReducer(pubKeyReducer, []);
  const [db, setDb] = useState(null);
  const [relays, setRelays] = useState<IRelay[]>(dummyRelays);
  const { relayClient, walletAddress } = useMyContext();
  useEffect(() => {
    createState();
  }, [relayClient]);

  useEffect(() => {
    if (walletAddress) {
      (async () => {
        const { Level } = await import("level");
        const storeId =
          localStorage.getItem("storeId") || process.env.NEXT_PUBLIC_STORE_ID;
        const dbName = `${storeId?.slice(0, 5)}${walletAddress?.slice(0, 5)}`;
        console.log("using level db:", { dbName });
        const db = new Level(`./${dbName}`, {
          valueEncoding: "json",
        });
        // @ts-expect-error FIXME
        setDb(db);
        if (window && db) {
          window.addEventListener("beforeunload", () => {
            console.log("closing db connection");
            db.close();
          });
        }
      })();
    }
  }, [walletAddress]);

  useEffect(() => {
    //FIXME: to fix once we intergrate multiple relays
    setRelays(dummyRelays);

    (async () => {
      if (db) {
        const productsLocal = (await getParsedMapData(
          "products",
          db,
        )) as ProductsMap;

        const tagsLocal = (await getParsedMapData("tags", db)) as TagsMap;
        const orderItemsLocal = (await getParsedMapData(
          "orderItems",
          db,
        )) as OrdersMap;

        const orderIdLocal = await getItem("orderId", db);
        const erc20AddrLocal = await getItem("erc20Addr", db);
        const publishedTagIdLocal = await getItem("publishedTagId", db);
        const storeDataLocal = await getItem("storeData", db);

        if (productsLocal?.size) {
          setProducts({
            type: SET_PRODUCTS,
            payload: {
              itemId: productsLocal.keys().next().value,
              allProducts: productsLocal,
            },
          });
        }
        if (tagsLocal?.size) {
          setAllTags({
            type: SET_ALL_TAGS,
            payload: { allTags: tagsLocal },
          });
        }
        if (orderItemsLocal?.size) {
          setOrderItems({
            type: SET_ALL_ORDER_ITEMS,
            payload: { allOrderItems: orderItemsLocal },
          });
        }
        if (orderIdLocal) {
          setOrderId(orderIdLocal as OrderId);
        }
        if (erc20AddrLocal && erc20AddrLocal !== null) {
          setErc20Addr(erc20AddrLocal as `0x${string}`);
        }
        if (publishedTagIdLocal) {
          setPublishedTagId(publishedTagIdLocal as TagId);
        }
        if (storeDataLocal) {
          setStoreData({
            type: SET_STORE_DATA,
            payload: {
              name: storeDataLocal.name!,
              profilePictureUrl: storeDataLocal.profilePictureUrl!,
            },
          });
        }
      }
    })();
  }, [relayClient, db]);

  useEffect(() => {
    pubKeys.length && orderItems.size && verify(orderItems, pubKeys);
  }, [pubKeys, orderItems]);

  useEffect(() => {
    try {
      products.size && setMapData("products", products, db);
    } catch (error) {
      console.log(error);
    }
  }, [products]);

  useEffect(() => {
    try {
      allTags.size && setMapData("tags", allTags, db);
    } catch (error) {
      console.log(error);
    }
  }, [allTags]);

  useEffect(() => {
    try {
      orderItems.size && setMapData("orderItems", orderItems, db);
    } catch (error) {
      console.log(error);
    }
  }, [orderItems]);

  useEffect(() => {
    try {
      orderId && setItem("orderId", orderId, db);
    } catch (error) {
      console.log(error);
    }
  }, [orderId]);

  useEffect(() => {
    try {
      storeData.name.length && setItem("storeData", storeData, db);
    } catch (error) {
      console.log(error);
    }
  }, [storeData]);

  useEffect(() => {
    try {
      erc20Addr && setItem("erc20Addr", erc20Addr, db);
    } catch (error) {
      console.log(error);
    }
  }, [erc20Addr]);

  useEffect(() => {
    try {
      publishedTagId && setItem("publishedTagId", publishedTagId, db);
    } catch (error) {
      console.log(error);
    }
  }, [publishedTagId]);

  const createState = async () => {
    try {
      const stream = relayClient && relayClient.createEventStream();
      if (stream) {
        // @ts-expect-error waiting on upstream fix in TS definitions
        for await (const evt of stream) {
          buildState(
            products,
            allTags,
            evt.event,
            setProducts,
            setAllTags,
            setOrderItems,
            setErc20Addr,
            setPublishedTagId,
            setFinalizedOrders,
            setPubKeys,
            setStoreData,
            walletAddress,
          );
        }
      }
    } catch (err) {
      console.error("error receiving events", err);
    }
  };
  const verify = async (
    _orderItems: Map<OrderId, OrderState>,
    _pubKeys: `0x${string}`[],
  ) => {
    console.log(_orderItems, _pubKeys);
    // const addresses = _pubKeys.map((k) => {
    //   return Address.fromPublicKey(hexToBytes(k)).toString();
    // });
    // const keysArr: `0x${string}`[] = _orderItems.size
    //   ? Array.from([..._orderItems.keys()])
    //   : [];
    // for (const _orderId of keysArr) {
    //   const _order = _orderItems.get(_orderId) as OrderState;
    //   if (_order && _order.status !== IStatus.Failed) {
    //     const sig = _order.signature as `0x${string}`;
    //     const retrievedAdd = await relayClient!.recoverSignedAddress(
    //       _orderId,
    //       sig,
    //     );
    //     if (addresses.includes(retrievedAdd.toLowerCase())) {
    //       console.log("inside inclue", _orderId);
    //       setOrderId(_orderId);
    //     }
    //   }
    // }
  };

  const addProduct = async (
    product: IProduct,
    selectedTagIds: TagId[] | [],
  ) => {
    try {
      const path = await relayClient!.uploadBlob(product.blob as FormData);
      console.log({ path });
      const metadata = {
        name: product.metadata.name,
        description: "adding product",
        image: path.url as string,
      };
      const priceAsNum = Number(product.price);
      product.price = priceAsNum.toFixed(2);
      const iid = bytesToHex(
        await relayClient!.createItem({
          price: product.price,
          metadata: new TextEncoder().encode(JSON.stringify(metadata)),
        }),
      );
      product.id = iid;
      product.tagIds = selectedTagIds;
      product.metadata = metadata;
      iid &&
        setProducts({
          type: ADD_PRODUCT,
          payload: { itemId: product.id, item: product },
        });

      changeStock([iid], [product.stockQty || 0]);

      selectedTagIds &&
        selectedTagIds.map((id) => {
          addProductToTag(id, iid);
        });
      return { id: iid, error: null };
    } catch (error) {
      console.error({ error });
      const errMsg = error as { message: string };
      return { error: errMsg.message };
    }
  };

  const updateProduct = async (
    itemId: ItemId,
    fields: { price: boolean; metadata: boolean; stockQty?: boolean },
    updatedProduct: IProduct,
    selectedTagIds: TagId[] | [],
  ) => {
    try {
      if (fields.price) {
        const priceAsNum = Number(updatedProduct.price);
        updatedProduct.price = priceAsNum.toFixed(2);
        await relayClient!.updateItem({ itemId, price: updatedProduct.price });
        setProducts({
          type: UPDATE_PRICE,
          payload: {
            itemId: itemId,
            price: updatedProduct.price,
          },
        });
      }
      if (fields.metadata) {
        const hasEmbeddedImage =
          updatedProduct.metadata.image.includes("data:image");
        const path = hasEmbeddedImage
          ? await relayClient!.uploadBlob(updatedProduct.blob as FormData)
          : { url: updatedProduct.metadata.image };

        const metadata = {
          name: updatedProduct.metadata.name,
          description: "updating product",
          image: path.url,
        };
        await relayClient!.updateItem({ itemId, metadata });
        setProducts({
          type: UPDATE_METADATA,
          payload: {
            itemId: itemId,
            metadata: metadata,
          },
        });
      }
      if (fields.stockQty) {
        //calculate unit difference
        const previousUnit = products.get(itemId)?.stockQty || 0;
        const diff = Number(updatedProduct.stockQty) - Number(previousUnit);
        changeStock([itemId], [diff]);
        setProducts({
          type: UPDATE_STOCKQTY,
          payload: {
            itemId: itemId,
            unitDiff: diff,
          },
        });
      }

      updatedProduct.tagIds = selectedTagIds;

      setProducts({
        type: UPDATE_PRODUCT,
        payload: { itemId: itemId, item: updatedProduct },
      });
      return { error: null };
    } catch (error) {
      console.log({ error });
      const errMsg = error as { message: string };
      return { error: errMsg.message };
    }
  };

  const createTag = async (name: string) => {
    try {
      const _name = name.slice(1);
      const id: TagId = bytesToHex(await relayClient!.createTag(_name));
      const tag = { id, text: _name, color: "special" }; // TODO: color: hex?
      setAllTags({ type: ADD_TAG, payload: { tag } });
      return { id, error: null };
    } catch (error) {
      console.log({ error });
      const errMsg = error as { message: string };
      return { error: errMsg.message };
    }
  };

  const addProductToTag = async (tagId: TagId, itemId: ItemId) => {
    try {
      await relayClient!.updateTag({ tagId, addItemId: itemId });
      setProducts({
        type: ADD_PRODUCT_TAGS,
        payload: {
          itemId,
          tagId,
        },
      });
      return { error: null };
    } catch (error) {
      console.log({ error });
      const errMsg = error as { message: string };
      return { error: errMsg.message };
    }
  };

  const removeProductFromTag = async (tagId: TagId, itemId: ItemId) => {
    try {
      await relayClient!.updateTag({ tagId, removeItemId: itemId });
      setProducts({
        type: REMOVE_PRODUCT_TAG,
        payload: {
          itemId,
          tagId,
        },
      });
      return { id: tagId, error: null };
    } catch (error) {
      console.log({ error });
      const errMsg = error as { message: string };
      return { error: errMsg.message };
    }
  };

  const updateOrder = async (itemId?: ItemId, saleQty: number = 0) => {
    const order_id = !orderId ? await createOrder() : orderId;
    try {
      const activeOrderItems =
        (orderId && orderItems.get(orderId)?.items) || {};

      if (!itemId) {
        //Clear order and set every item in order to quantity 0
        const itemIds = Object.keys(activeOrderItems);
        for (const itemId of itemIds) {
          await relayClient!.updateOrder({
            orderId: order_id,
            changeItems: { itemId, quantity: 0 },
          });
        }
        setOrderItems({ type: CLEAR_ORDER, payload: { orderId: order_id } });
      } else if (saleQty === 0) {
        //delete it from orderItems
        await relayClient!.updateOrder({
          order: order_id,
          changeItems: { itemId, quantity: saleQty },
        });
        setOrderItems({
          type: REMOVE_ORDER_ITEM,
          payload: {
            itemId,
            orderId: order_id,
          },
        });
      } else {
        //update item sale qty
        await relayClient!.updateOrder({
          orderId: order_id,
          changeItems: { itemId, quantity: saleQty },
        });
        // const difference = (activeOrderItems?.[itemId] || 0) - Number(saleQty);
        // updateUnitChnage(itemId, difference);

        setOrderItems({
          type: UPDATE_ORDER_ITEM,
          payload: {
            orderId: order_id,
            itemId,
            saleQty,
          },
        });
      }
      return { error: null };
    } catch (error) {
      const errMsg = error as { message: string };
      return {
        error: `${errMsg.message}. Create New Sale in the navigation menu. `,
      };
    }
  };

  const invalidateOrder = async (msg: string | null = null) => {
    try {
      console.log(`Invalidating order: ${msg}`);
      if (!orderId) throw Error(`No ${orderId} found`);
      if (!relayClient) throw Error(`Disconnected from relayClient`);
      await relayClient.updateOrder({ orderId, orderCancelled: {} });
      setOrderItems({
        type: UPDATE_ORDER_STATUS,
        payload: { orderId: orderId as OrderId, status: IStatus.Failed },
      });
      await createOrder();
    } catch (error) {
      setOrderItems({
        type: UPDATE_ORDER_STATUS,
        payload: { orderId: orderId as OrderId, status: IStatus.Failed },
      });
      await createOrder();
    }
  };

  const createOrder = async () => {
    const orderId = bytesToHex(await relayClient!.createOrder());
    setOrderId(orderId);
    return orderId;
  };

  const changeStock = async (itemIds: ItemId[], diffs: number[]) => {
    await relayClient!.changeStock({ itemIds, diffs });
  };

  const commitOrder = async (isERC20Checkout: boolean) => {
    try {
      const erc20 = erc20Addr && isERC20Checkout ? erc20Addr : null;
      if (isERC20Checkout && !erc20Addr) {
        return { error: "no erc20 address found." };
      } else if (!orderId) {
        return { error: "no order set" };
      }
      if (erc20) {
        console.log("committing order with erc20");
      }
      if (!relayClient) throw Error(`Disconnected from relayClient`);

      const checkout = await relayClient.commitOrder({
        orderId,
        currency: erc20,
      });
      return {
        requestId: bytesToHex(checkout.requestId),
        orderFinalizedId: bytesToHex(checkout.orderFinalizedId),
        error: null,
      };
    } catch (error) {
      const errMsg = error as { message: string };
      invalidateOrder(errMsg.message);
      return { error: errMsg.message };
    }
  };

  const value = {
    products,
    allTags,
    orderItems,
    orderId,
    erc20Addr,
    publishedTagId,
    finalizedOrders,
    relays,
    db,
    storeData,
    addProduct,
    updateProduct,
    createState,
    createTag,
    addProductToTag,
    removeProductFromTag,
    updateOrder,
    commitOrder,
    invalidateOrder,
    setErc20Addr,
    setPublishedTagId,
    setOrderId,
  };

  return (
    // @ts-expect-error FIXME
    <StoreContext.Provider value={value}>
      {props.children}
    </StoreContext.Provider>
  );
};

export const useStoreContext = () => useContext(StoreContext);
