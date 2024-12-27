// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

export const ADD_KC_PUBKEY = "ADD_KC_PUBKEY";
export type pubKeyAction = {
  type: "ADD_KC_PUBKEY";
  payload: { cardPublicKey: `0x${string}` };
};
export const pubKeyReducer = (state: `0x${string}`[], action: pubKeyAction) => {
  switch (action.type) {
    case ADD_KC_PUBKEY:
      return [...state, action.payload.cardPublicKey];
    default:
      return state;
  }
};
