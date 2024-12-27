export const UPDATE_STORE_NAME = "UPDATE_STORE_NAME";
export const UPDATE_STORE_PIC = "UPDATE_STORE_PIC";
export const SET_STORE_DATA = "SET_STORE_DATA";
export const UPDATE_BASE_CURRENCY = "UPDATE_BASE_CURRENCY";

type storeState = {
  name: string;
  profilePictureUrl: string;
  baseCurrencyAddr: `0x${string}` | null;
};
type nameUpdate = {
  type: "UPDATE_STORE_NAME";
  payload: {
    name: string;
  };
};
type urlUpdate = {
  type: "UPDATE_STORE_PIC";
  payload: {
    profilePictureUrl: string;
  };
};
type setStore = {
  type: "SET_STORE_DATA";
  payload: {
    name: string;
    profilePictureUrl: string;
    baseCurrencyAddr: `0x${string}` | null;
  };
};
type baseCurrencyUpdate = {
  type: "UPDATE_BASE_CURRENCY";
  payload: {
    baseCurrencyAddr: `0x${string}` | null;
  };
};
export type updateStoreDataAction =
  | nameUpdate
  | urlUpdate
  | setStore
  | baseCurrencyUpdate;
export const storeReducer = (
  state: storeState,
  action: updateStoreDataAction,
) => {
  switch (action.type) {
    case UPDATE_BASE_CURRENCY:
      return { ...state, baseCurrencyAddr: action.payload.baseCurrencyAddr };
    case UPDATE_STORE_NAME:
      return { ...state, name: action.payload.name };
    case UPDATE_STORE_PIC:
      return { ...state, profilePictureUrl: action.payload.profilePictureUrl };
    case SET_STORE_DATA:
      return {
        name: action.payload.name,
        profilePictureUrl: action.payload.profilePictureUrl,
        baseCurrencyAddr: action.payload.baseCurrencyAddr,
      };
    default:
      return state;
  }
};
