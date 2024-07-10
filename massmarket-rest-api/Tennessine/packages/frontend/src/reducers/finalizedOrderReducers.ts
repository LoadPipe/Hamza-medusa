// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { FinalizedOrderState } from "../context/types";
export const SET_ORDER = "SET_ORDER";
export type EventId = `0x${string}`;

export type finalizedOrderActions = {
  type: "SET_ORDER";
  payload: { order: FinalizedOrderState; eventId: EventId };
};

export const finalizedOrderReducer = (
  state: Map<EventId, FinalizedOrderState>,
  action: finalizedOrderActions,
): Map<EventId, FinalizedOrderState> => {
  const _state = new Map(state);

  switch (action.type) {
    case SET_ORDER:
      _state.set(action.payload.eventId, action.payload.order);
      return _state;
    default:
      return state;
  }
};
