export const UPDATE_STORE_NAME = "UPDATE_STORE_NAME";
export const UPDATE_STORE_URL = "UPDATE_STORE_URL";
export const SET_STORE_DATA = "SET_STORE_DATA";

type storeState = {
  name: string;
  profilePictureUrl: string;
};
type nameUpdate = {
  type: "UPDATE_STORE_NAME";
  payload: {
    name: string;
  };
};
type urlUpdate = {
  type: "UPDATE_STORE_URL";
  payload: {
    profilePictureUrl: string;
  };
};
type setStore = {
  type: "SET_STORE_DATA";
  payload: {
    name: string;
    profilePictureUrl: string;
  };
};
export type updateStoreDataAction = nameUpdate | urlUpdate | setStore;
export const storeReducer = (
  state: storeState,
  action: updateStoreDataAction,
) => {
  switch (action.type) {
    case UPDATE_STORE_NAME:
      return { ...state, name: action.payload.name };
    case UPDATE_STORE_URL:
      return { ...state, profilePictureUrl: action.payload.profilePictureUrl };
    case SET_STORE_DATA:
      return {
        name: action.payload.name,
        profilePictureUrl: action.payload.profilePictureUrl,
      };
    default:
      return state;
  }
};
