// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { Dispatch, SetStateAction } from "react";
import { type PublicClient } from "viem";

import { IProduct, ITag, IStatus, IRelay } from "@/types";
import { Level } from "level";
import { RelayClient, WalletClientWithAccount } from "@massmarket/client";
import { updateStoreDataAction } from "@/reducers/storeReducer";

export type ItemId = `0x${string}`;
export type TagId = `0x${string}`;
export type OrderId = `0x${string}`;
export type EventId = `0x${string}`;
export type ShopId = `0x${string}`;

export type FinalizedOrderState = {
  erc20Addr: `0x${string}` | null;
  orderId: OrderId;
  purchaseAddress: `0x${string}`;
  salesTax: string | null;
  total: string | null;
  totalInCrypto: string | null;
  subTotal: string | null;
};
export type UpdateItemProps = {
  itemId: ItemId;
  value: number | { title: string; description: string; image: string };
};

export type storeState = {
  name: string;
  profilePictureUrl: string;
  baseCurrencyAddr: `0x${string}` | null;
};

export type ItemState = { [key: ItemId]: number };
export type OrderState = {
  items: ItemState;
  status?: IStatus;
  txHash?: `0x${string}`;
};

export type IRelayWriteResponse = {
  // TODO: should be mmproto.EventWriteResponse but can't import anymore somehow
};

export type ClientContext = {
  keyCardEnrolled: boolean;
  walletAddress: `0x${string}` | null;
  clientWallet: WalletClientWithAccount | null;
  balance: string | null;
  avatar: string | null;
  name: string | null;
  relayClient: RelayClient | null;
  publicClient: PublicClient | null;
  inviteSecret: `0x${string}` | null;
  shopId: ShopId;
  setShopId: Dispatch<SetStateAction<ShopId>>;
  setKeyCardEnrolled: Dispatch<SetStateAction<boolean>>;
  setInviteSecret: Dispatch<SetStateAction<`0x${string}` | null>>;
  setWallet: Dispatch<SetStateAction<WalletClientWithAccount | null>>;
  getTokenInformation: (
    d: `0x${string}`,
  ) => Promise<{ name: string; symbol: string; decimals: number }>;
  checkPermissions: () => Promise<boolean>;
  setRelayClient: Dispatch<SetStateAction<RelayClient | null>>;
  createNewRelayClient: () => RelayClient | null;
};

export type StoreContent = {
  relays: IRelay[];
  products: Map<ItemId, IProduct>;
  allTags: Map<TagId, ITag>;
  orderItems: Map<OrderId, OrderState>;
  orderId: OrderId | null;
  erc20Addr: `0x${string}` | null;
  publishedTagId: TagId | null;
  finalizedOrders: Map<EventId, FinalizedOrderState>;
  db: Level<string, string>;
  storeData: storeState;
  addProduct: (
    p: IProduct,
    keysArr: ItemId[] | [],
  ) => Promise<{ id?: ItemId; error: null | string }>;
  updateProduct: (
    itemId: ItemId,
    updatedFields: { price: boolean; metadata: boolean },
    newProduct: IProduct,
    keysArr: ItemId[] | [],
  ) => Promise<{ error: string | null }>;
  createState: () => void;
  createTag: (name: string) => Promise<{ id?: TagId; error: null | string }>;
  addProductToTag: (
    tagId: TagId,
    itemId: ItemId,
  ) => Promise<{ error: string | null }>;
  removeProductFromTag: (
    tagId: TagId,
    itemId: ItemId,
  ) => Promise<{ id?: TagId; error: string | null }>;
  updateOrder: (
    itemId?: ItemId,
    saleQty?: number,
  ) => Promise<{ error: string | null }>;
  commitOrder: (erc20: boolean) => Promise<{
    orderFinalizedId?: OrderId;
    requestId?: `0x${string}`;
    error: string | null;
    erc20?: `0x${string}`;
  }>;
  invalidateOrder: (msg: string) => void;
  setErc20Addr: (erc20: `0x${string}`) => void;
  setPublishedTagId: (id: TagId) => void;
  setOrderId: (orderId: OrderId | null) => void;
  setStoreData: Dispatch<updateStoreDataAction>;
};

export type ProductsMap = Map<ItemId, IProduct>;
export type TagsMap = Map<TagId, ITag>;
export type OrdersMap = Map<OrderId, OrderState>;
