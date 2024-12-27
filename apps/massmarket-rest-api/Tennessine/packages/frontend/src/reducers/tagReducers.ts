// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { ITag, TagId } from "@/types";

export const ADD_TAG = "ADD_TAG";
export const SET_ALL_TAGS = "SET_ALL_TAGS";
export const DESELECT_TAG = "DESELECT_TAG";
export const SELECT_TAG = "SELECT_TAG";
export const RESET_TAGS = "RESET_TAGS";
export const CLEAR_ALL_TAGS = "CLEAR_ALL_TAGS";
export const TURN_ON_SEARCH_VIS = "TURN_ON_SEARCH_VIS";
export const TURN_OFF_SEARCH_VIS = "TURN_OFF_SEARCH_VIS";
export const ALL_TAGS = "ALL_TAGS";

export type selectedTagsAction = {
  type: "SELECT_TAG" | "DESELECT_TAG" | "RESET_TAGS";
  payload: { selectedTag: ITag };
};

export const selectedTagReducer = (
  state: Map<TagId, ITag>,
  action: selectedTagsAction,
) => {
  const _state = new Map(state);
  switch (action.type) {
    case SELECT_TAG:
      _state.set(action.payload.selectedTag.id, action.payload.selectedTag);
      return _state;
    case DESELECT_TAG:
      _state.delete(action.payload.selectedTag.id);
      return _state;
    case RESET_TAGS:
      _state.clear();
      return _state;
    default:
      return _state;
  }
};

export type allTagsAction =
  | {
      type: "ADD_TAG";
      payload: { tag: ITag };
    }
  | {
      type: "SET_ALL_TAGS";
      payload: { allTags: Map<TagId, ITag> };
    }
  | {
      type: "CLEAR_ALL_TAGS";
    };

export const allTagsReducer = (
  state: Map<`0x${string}`, ITag>,
  action: allTagsAction,
) => {
  const _state = new Map(state);

  switch (action.type) {
    case ADD_TAG:
      _state.set(action.payload.tag.id, action.payload.tag);
      return _state;
    case SET_ALL_TAGS:
      return action.payload.allTags;
    case CLEAR_ALL_TAGS:
      _state.clear();
      return _state;
    default:
      return state;
  }
};

type visibilityAction =
  | {
      type: "TURN_ON_SEARCH_VIS" | "TURN_OFF_SEARCH_VIS";
      payload: { tag: ITag };
    }
  | {
      type: "ALL_TAGS";
    };

export const searchReducer = (
  state: Map<TagId, ITag>,
  action: visibilityAction,
) => {
  const newState = new Map(state);

  switch (action.type) {
    case TURN_ON_SEARCH_VIS:
      newState.set(action.payload?.tag.id, action.payload?.tag);
      return newState;
    case TURN_OFF_SEARCH_VIS:
      newState.delete(action.payload?.tag.id);
      return newState;
    case ALL_TAGS:
      newState.clear();
      return newState;
    default:
      return state;
  }
};
