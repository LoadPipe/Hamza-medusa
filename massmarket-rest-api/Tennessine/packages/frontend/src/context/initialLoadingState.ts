// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { dummyRelays } from "./dummyData";

export const initialStoreContext = {
  products: new Map(),
  allTags: new Map(),
  cartItems: new Map(),
  cartId: null,
  erc20Addr: null,
  publishedTagId: null,
  finalizedCarts: new Map(),
  relays: dummyRelays,
  updateCart: () =>
    new Promise(() => {
      return { error: null };
    }),
  addProduct: () =>
    new Promise(() => {
      return { error: null };
    }),
  updateProduct: () =>
    new Promise(() => {
      return { error: null };
    }),
  createState: () => {},
  createTag: () =>
    new Promise(() => {
      return {
        id: `0x`,
        error: null,
      };
    }),
  addProductToTag: () =>
    new Promise(() => {
      return {
        tagId: `0x`,
        itemId: `0x`,
      };
    }),
  removeProductFromTag: () =>
    new Promise(() => {
      return {
        error: null,
      };
    }),
  commitCart: () =>
    new Promise(() => {
      return {
        cartFinalizedId: `0x`,
        requestId: `0x`,
        error: null,
      };
    }),
  invalidateCart: () => {},
  setErc20Addr: () => {},
  setPublishedTagId: () => {},
  setCartId: () => {},
};
