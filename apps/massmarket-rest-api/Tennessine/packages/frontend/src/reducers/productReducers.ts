// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { IProduct, Metadata, ItemId, TagId } from "@/types";

export const ADD_PRODUCT = "ADD_PRODUCT";
// export const REMOVE_PRODUCT = "REMOVE_PRODUCT";
export const UPDATE_PRODUCT = "UPDATE_PRODUCT";
export const UPDATE_METADATA = "UPDATE_METADATA";
export const UPDATE_PRICE = "UPDATE_PRICE";
export const ADD_PRODUCT_TAGS = "ADD_PRODUCT_TAGS";
export const REMOVE_PRODUCT_TAG = "REMOVE_PRODUCT_TAG";
export const SET_PRODUCTS = "SET_PRODUCTS";
export const UPDATE_STOCKQTY = "UPDATE_STOCKQTY";
export const CLEAR_PRODUCTS = "CLEAR_PRODUCTS";
export type productAction =
  | {
      type: "ADD_PRODUCT" | "UPDATE_PRODUCT";

      payload: { itemId: ItemId; item: IProduct };
    }
  | {
      type: "SET_PRODUCTS";
      payload: { allProducts: Map<ItemId, IProduct> };
    }
  | {
      type: "CLEAR_PRODUCTS";
    };

export type updateProductAction =
  | updateMetadataAction
  | updatePriceAction
  | updateProductTags
  | updateStockyQty;

type updateMetadataAction = {
  type: "UPDATE_METADATA";
  payload: {
    itemId: ItemId;
    metadata: Metadata;
  };
};
type updatePriceAction = {
  type: "UPDATE_PRICE";
  payload: {
    itemId: ItemId;
    price: string;
  };
};
type updateProductTags = {
  type: "ADD_PRODUCT_TAGS" | "REMOVE_PRODUCT_TAG";
  payload: {
    itemId: ItemId;
    tagId: TagId;
  };
};
export type updateStockyQty = {
  type: "UPDATE_STOCKQTY";
  payload: {
    itemId: ItemId;
    unitDiff: number;
  };
};

export const productReducer = (
  state: Map<ItemId, IProduct>,
  action: updateProductAction | productAction,
) => {
  const _state = new Map(state);

  switch (action.type) {
    case CLEAR_PRODUCTS:
      _state.clear();
      return _state;
    case ADD_PRODUCT:
    case UPDATE_PRODUCT:
      _state.set(action.payload.itemId, { ...action.payload.item });
      return _state;
    case SET_PRODUCTS:
      return action.payload.allProducts;
    case UPDATE_METADATA:
    case UPDATE_PRICE:
    case ADD_PRODUCT_TAGS:
    case REMOVE_PRODUCT_TAG:
    case UPDATE_STOCKQTY:
      _state.set(
        action.payload.itemId,
        productItemReducer(_state.get(action.payload.itemId)!, action),
      );
      return _state;
    default:
      return state;
  }
};

const productTagReducer = (
  state: TagId[],
  action: productAction | updateProductAction | updateProductTags,
) => {
  switch (action.type) {
    case REMOVE_PRODUCT_TAG:
      return [...state.filter((ele: TagId) => ele !== action.payload.tagId)];
    case ADD_PRODUCT_TAGS:
      return [...state, action.payload.tagId];
    default:
      return state;
  }
};

const productItemReducer = (
  state: IProduct,
  action:
    | productAction
    | updateProductAction
    | updateMetadataAction
    | updatePriceAction
    | updateProductTags,
) => {
  switch (action.type) {
    case UPDATE_METADATA:
      return {
        ...state,
        metadata: action.payload.metadata,
      };
    case UPDATE_STOCKQTY:
      return {
        ...state,
        stockQty:
          Number(state?.stockQty ? state.stockQty : 0) +
          Number(action.payload.unitDiff),
      };
    case REMOVE_PRODUCT_TAG:
    case ADD_PRODUCT_TAGS:
      return {
        ...state,
        tagIds: productTagReducer(state.tagIds ? state.tagIds : [], action),
      };
    case UPDATE_PRICE:
      return {
        ...state,
        price: action.payload.price,
      };
    default:
      return state;
  }
};

export const EDIT_TITLE = "EDIT_TITLE";
export const EDIT_IMG = "EDIT_IMG";
export const EDIT_PRICE = "EDIT_PRICE";
export const EDIT_UNIT = "EDIT_UNIT";
export const UPLOAD_IMG = "UPLOAD_IMG";
export const EDIT_DESC = "EDIT_DESC";

export const initialState = {
  id: "0x0" as ItemId,
  metadata: { name: "", image: "", description: "" },
  price: "0",
  stockQty: 0,
  blob: null,
};
type editUnit = {
  type: "EDIT_UNIT";
  payload: {
    unit: number;
  };
};
type editTitle = {
  type: "EDIT_TITLE";
  payload: {
    name: string;
  };
};
type editPrice = {
  type: "EDIT_PRICE";
  payload: {
    price: string;
  };
};
type editImg = {
  type: "EDIT_IMG";
  payload: {
    img: string;
  };
};
type uploadImg = {
  type: "UPLOAD_IMG";
  payload: {
    blob: Blob | FormData | null;
  };
};
type editDescription = {
  type: "EDIT_DESC";
  payload: {
    description: string;
  };
};
export type newProductActions =
  | uploadImg
  | editImg
  | editPrice
  | editTitle
  | editUnit
  | editDescription;
export const newProductReducer = (
  state: IProduct,
  action: newProductActions,
): IProduct => {
  switch (action.type) {
    case EDIT_TITLE:
    case EDIT_DESC:
      return {
        ...state,
        metadata: updateNewProductReducer(state.metadata, action),
      };
    case EDIT_IMG:
      return {
        ...state,
        metadata: updateNewProductReducer(state.metadata, action),
      };
    case EDIT_PRICE:
      return { ...state, price: action.payload.price };
    case EDIT_UNIT:
      return { ...state, stockQty: action.payload.unit };
    case UPLOAD_IMG:
      return { ...state, blob: action.payload.blob };
    default:
      return { ...state };
  }
};

export const updateNewProductReducer = (
  state: Metadata,
  action: editImg | editTitle | editDescription,
) => {
  switch (action.type) {
    case EDIT_IMG:
      return { ...state, image: action.payload.img };
    case EDIT_TITLE:
      return { ...state, name: action.payload.name };
    case EDIT_DESC:
      return { ...state, description: action.payload.description };
    default:
      return { ...state };
  }
};
