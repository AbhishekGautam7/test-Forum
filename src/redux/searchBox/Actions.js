import {
    SET_SEARCH_BOX_STATUS,SET_SEARCH_TXT
  } from "./Types";

  export const setSearchBoxStatus = (payload) => {
    return {
      type: SET_SEARCH_BOX_STATUS,
      payload: payload,
    };
  };

  export const setSearchBoxKeyword = (payload) => {
    return {
      type: SET_SEARCH_TXT,
      payload: payload,
    };
  };
