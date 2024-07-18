// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import {
  ADD_PRODUCT,
  UPDATE_METADATA,
  UPDATE_PRICE,
  ADD_PRODUCT_TAGS,
  REMOVE_PRODUCT_TAG,
  UPDATE_STOCKQTY,
  updateProductAction,
  productAction,
} from "@/reducers/productReducers";
import { ADD_TAG, allTagsAction } from "@/reducers/tagReducers";
import { bytesToHex } from "viem";
import { parseMetadata } from "@/app/utils";
import { IProduct, IStatus, ITag, ItemId, TagId } from "@/types";
import {
  UPDATE_ORDER_ITEM,
  REMOVE_ORDER_ITEM,
  UPDATE_ORDER_STATUS,
  UPDATE_ORDER_HASH,
  SET_ORDER_SIG,
  allOrderActions,
} from "@/reducers/orderReducers";
import {
  SET_ORDER,
  finalizedOrderActions,
} from "@/reducers/finalizedOrderReducers";
import {
  SET_STORE_DATA,
  updateStoreDataAction,
  UPDATE_STORE_PIC,
  UPDATE_BASE_CURRENCY,
} from "@/reducers/storeReducer";
import { ADD_KC_PUBKEY, pubKeyAction } from "@/reducers/KCPubKeysReducers";
import { Dispatch } from "react";
import schema from "@massmarket/schema";

export const buildState = (
  products: Map<ItemId, IProduct>,
  allTags: Map<TagId, ITag>,
  event: schema.IShopEvent,
  productsDispatch: Dispatch<updateProductAction | productAction>,
  tagsDisaptch: Dispatch<allTagsAction>,
  setOrderItems: Dispatch<allOrderActions>,
  setPublishedTagId: Dispatch<TagId>,
  setFinalizedOrders: Dispatch<finalizedOrderActions>,
  setPubKeys: Dispatch<pubKeyAction>,
  setStoreData: Dispatch<updateStoreDataAction>,
  walletAddress?: `0x${string}` | null,
) => {
  if (event.shopManifest) {
    const sm = event.shopManifest;
    setPublishedTagId(bytesToHex(sm.publishedTagId!));
    setStoreData({
      type: SET_STORE_DATA,
      payload: {
        name: sm.name!,
        profilePictureUrl: sm.profilePictureUrl!,
        baseCurrencyAddr: null,
      },
    });
  } else if (event.updateShopManifest) {
    const um = event.updateShopManifest;
    if (um.profilePictureUrl) {
      setStoreData({
        type: UPDATE_STORE_PIC,
        payload: { profilePictureUrl: um.profilePictureUrl! },
      });
    }
    if (um.publishedTagId) {
      console.log(
        `Resetting published tag id to: ${bytesToHex(um.publishedTagId)}`,
      );
      setPublishedTagId(bytesToHex(um.publishedTagId));
    }
    if (um.setBaseCurrency) {
      setStoreData({
        type: UPDATE_BASE_CURRENCY,
        payload: { baseCurrencyAddr: bytesToHex(um.setBaseCurrency.tokenAddr) },
      });
    }
  } else if (event.createItem) {
    const _meta = parseMetadata(event.createItem.metadata!);
    const id = bytesToHex(event.createItem.eventId!);
    const item: IProduct = {
      id,
      price: event.createItem.price!,
      metadata: _meta,
    };
    productsDispatch({ type: ADD_PRODUCT, payload: { itemId: id, item } });
  } else if (event.updateItem) {
    const ui = event.updateItem;
    const id = bytesToHex(ui.itemId!);
    if (ui.metadata) {
      const _meta = parseMetadata(ui.metadata);
      productsDispatch({
        type: UPDATE_METADATA,
        payload: {
          itemId: id,
          metadata: _meta,
        },
      });
    } else if (ui.price) {
      productsDispatch({
        type: UPDATE_PRICE,
        payload: {
          itemId: id,
          price: ui.price,
        },
      });
    }
  } else if (event.createTag) {
    const id = bytesToHex(event.createTag.eventId!);
    const tag = { id, text: event.createTag.name! };
    tagsDisaptch({ type: ADD_TAG, payload: { tag } });
  } else if (event.updateTag) {
    const ut = event.updateTag;
    const tagId = bytesToHex(ut.tagId!);
    if (ut.addItemId) {
      const itemId = bytesToHex(ut.addItemId!);
      productsDispatch({
        type: ADD_PRODUCT_TAGS,
        payload: {
          itemId: itemId,
          tagId: tagId,
        },
      });
    }
    if (ut.removeItemId) {
      const itemId = bytesToHex(ut.removeItemId!);
      productsDispatch({
        type: REMOVE_PRODUCT_TAG,
        payload: {
          itemId: itemId,
          tagId: tagId,
        },
      });
    }
    if (ut.rename || ut.delete) {
      throw new Error(`not yet handling tag renames or deltes`);
    }
  } else if (event.changeStock) {
    const evt = event.changeStock;
    if (evt.orderId && evt.orderId.byteLength && evt.txHash) {
      setOrderItems({
        type: UPDATE_ORDER_STATUS,
        payload: {
          orderId: bytesToHex(evt.orderId),
          status: IStatus.Complete,
        },
      });
      setOrderItems({
        type: UPDATE_ORDER_HASH,
        payload: {
          orderId: bytesToHex(evt.orderId),
          txHash: bytesToHex(evt.txHash),
        },
      });
    }
    evt.itemIds?.length &&
      evt.itemIds.map((id: Uint8Array, i: number) => {
        const itemId = bytesToHex(id);
        productsDispatch({
          type: UPDATE_STOCKQTY,
          payload: {
            itemId: itemId,
            unitDiff: evt.diffs ? evt.diffs[i] : 0,
          },
        });
      });
  } else if (event.createOrder) {
    const orderId = bytesToHex(event.createOrder.eventId!);
    const signature = "0x0";
    setOrderItems({
      type: SET_ORDER_SIG,
      payload: {
        orderId,
        signature,
      },
    });
  } else if (event.updateOrder) {
    const uo = event.updateOrder;
    const eventId = uo.eventId;
    const _orderId = bytesToHex(uo.orderId!);

    if (uo.changeItems) {
      const ci = uo.changeItems;
      const itemId = bytesToHex(ci.itemId!);
      const quantity = ci.quantity!;
      if (quantity === 0) {
        setOrderItems({
          type: REMOVE_ORDER_ITEM,
          payload: { itemId: itemId, orderId: _orderId },
        });
      } else {
        setOrderItems({
          type: UPDATE_ORDER_ITEM,
          payload: { itemId: itemId, saleQty: quantity, orderId: _orderId },
        });
      }
    }
    if (uo.itemsFinalized) {
      console.log(uo.itemsFinalized);
      const {
        currencyAddr,
        orderHash,
        payeeAddr,
        salesTax,
        total,
        totalInCrypto,
        subTotal,
      } = uo.itemsFinalized;
      const orderObj = {
        erc20Addr: currencyAddr ? bytesToHex(currencyAddr) : null,
        orderId: bytesToHex(orderHash!),
        purchaseAddress: bytesToHex(payeeAddr!),
        salesTax: salesTax || null,
        total: total || null,
        subTotal: subTotal || null,
        totalInCrypto: bytesToHex(totalInCrypto) || null,
      };
      setFinalizedOrders({
        type: SET_ORDER,
        payload: {
          orderId: bytesToHex(eventId!),
          order: orderObj,
        },
      });
    }
  } else if (event.newKeyCard) {
    const userWalletAddr = bytesToHex(event.newKeyCard.userWalletAddr!);
    const cardPublicKey = bytesToHex(event.newKeyCard.cardPublicKey!);
    if (
      walletAddress &&
      walletAddress.toLowerCase() == userWalletAddr.toLowerCase()
    ) {
      setPubKeys({
        type: ADD_KC_PUBKEY,
        payload: {
          cardPublicKey,
        },
      });
    }
  } else {
    console.error(event);
    throw new Error(`Unhandled event type! ${Array.isArray(event)}`);
  }
  return { _products: products, _allTags: allTags };
};
