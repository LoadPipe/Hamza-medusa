// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { FinalizedOrderState } from "../context/types";
export const SET_ORDER = "SET_ORDER";
export type OrderId = `0x${string}`;

export type finalizedOrderActions = {
  type: "SET_ORDER";
  payload: { order: FinalizedOrderState; orderId: OrderId };
};

export const finalizedOrderReducer = (
  state: Map<OrderId, FinalizedOrderState>,
  action: finalizedOrderActions,
): Map<OrderId, FinalizedOrderState> => {
  const _state = new Map(state);

  switch (action.type) {
    case SET_ORDER:
      _state.set(action.payload.orderId, action.payload.order);
      return _state;
    default:
      return state;
  }
};
