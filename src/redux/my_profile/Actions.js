import { SET_MY_PROFILE } from "./Types";

export const setMyProfile = (payload) => {
  return {
    type: SET_MY_PROFILE,
    payload: payload,
  };
};
