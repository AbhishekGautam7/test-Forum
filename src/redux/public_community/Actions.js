import { SET_PUBLIC_COMMUNITY,REMOVE_PUBLIC_COMMUNITY } from "./Types";

export const setPublicCommunity = (payload) => {
  return {
    type: SET_PUBLIC_COMMUNITY,
    payload: payload,
  };
};

export const removePublicCommunity = (payload) => {
  return {
    type: REMOVE_PUBLIC_COMMUNITY,
    payload: payload,
  };
};
