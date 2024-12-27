// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { IStatus, OrderId, ItemId } from "@/types";

export const REMOVE_ORDER_ITEM = "REMOVE_ORDER_ITEM";
export const CLEAR_ORDER = "CLEAR_ORDER";
export const UPDATE_ORDER_ITEM = "UPDATE_ORDER_ITEM";
export const SET_ALL_ORDER_ITEMS = "SET_ALL_ORDER_ITEMS";
export const UPDATE_ORDER_STATUS = "UPDATE_ORDER_STATUS";
export const UPDATE_ORDER_HASH = "UPDATE_ORDER_HASH";
export const SET_ORDER_SIG = "SET_ORDER_SIG";
export const CLEAR_ALL_ORDERS = "CLEAR_ALL_ORDERS";

type orderAction = {
  type: "REMOVE_ORDER_ITEM";
  payload: { orderId: OrderId; itemId: ItemId };
};
type updateOrderAction = {
  type: "UPDATE_ORDER_ITEM";
  payload: { orderId: OrderId; itemId: ItemId; saleQty: number };
};
type clearAction = {
  type: "CLEAR_ORDER";
  payload: { orderId: OrderId };
};
type setAllITems =
  | {
      type: "SET_ALL_ORDER_ITEMS";
      payload: {
        allOrderItems: Map<OrderId, { [key: ItemId]: number }>;
      };
    }
  | {
      type: "CLEAR_ALL_ORDERS";
    };
type statusUpdate = {
  type: "UPDATE_ORDER_STATUS";
  payload: {
    orderId: OrderId;
    status: IStatus;
  };
};
type hashUpdate = {
  type: "UPDATE_ORDER_HASH";
  payload: {
    orderId: OrderId;
    txHash: `0x${string}`;
  };
};
type sigUpdate = {
  type: "SET_ORDER_SIG";
  payload: {
    orderId: OrderId;
    signature: `0x${string}`;
  };
};

type ItemState = { [key: ItemId]: number };
export type OrderState = {
  items: ItemState;
  status?: IStatus;
  txHash?: `0x${string}`;
  signature?: `0x${string}`;
};

export type allOrderActions =
  | orderAction
  | clearAction
  | updateOrderAction
  | setAllITems
  | statusUpdate
  | hashUpdate
  | sigUpdate;

export const orderReducer = (
  state: Map<OrderId, OrderState>,
  action: allOrderActions,
): Map<OrderId, OrderState> => {
  const _state = new Map(state);
  switch (action.type) {
    case CLEAR_ALL_ORDERS:
      _state.clear();
      return _state;
    case UPDATE_ORDER_ITEM:
      _state.set(
        action.payload.orderId,
        orderStateReducer(
          _state.get(action.payload.orderId) || { items: {} },
          action,
        ),
      );
      return _state;
    case SET_ALL_ORDER_ITEMS:
      return action.payload.allOrderItems as Map<OrderId, OrderState>;
    case UPDATE_ORDER_STATUS:
    case REMOVE_ORDER_ITEM:
    case UPDATE_ORDER_HASH:
    case CLEAR_ORDER:
    case SET_ORDER_SIG:
      _state.set(
        action.payload.orderId,
        orderStateReducer(
          _state.get(action.payload.orderId) || { items: {} },
          action,
        ),
      );
      return _state;
    default:
      return _state;
  }
};
function orderStateReducer(
  state: OrderState,
  action:
    | orderAction
    | updateOrderAction
    | statusUpdate
    | hashUpdate
    | clearAction
    | sigUpdate,
): OrderState {
  switch (action.type) {
    case UPDATE_ORDER_ITEM:
    case REMOVE_ORDER_ITEM:
      return {
        ...state,
        items: orderItemReducer({ ...state.items }, action),
      };
    case UPDATE_ORDER_STATUS:
      return {
        ...state,
        status: action.payload.status,
      };
    case UPDATE_ORDER_HASH:
      return {
        ...state,
        txHash: action.payload.txHash,
      };
    case CLEAR_ORDER:
      return {
        ...state,
        items: {},
      };
    case SET_ORDER_SIG:
      return {
        ...state,
        signature: action.payload.signature,
      };
    default:
      return { ...state };
  }
}
function orderItemReducer(
  state: ItemState,
  action: orderAction | updateOrderAction | statusUpdate,
): ItemState {
  switch (action.type) {
    case UPDATE_ORDER_ITEM:
      return {
        ...state,
        [action.payload.itemId]: action.payload.saleQty,
      };
    case REMOVE_ORDER_ITEM:
      delete state[action.payload.itemId];
      return { ...state };
    default:
      return { ...state };
  }
}
