import {
  SET_FAVORITE_COMMUNITY,
  ADD_FAVORITE_COMMUNITY,
  REMOVE_FAVORITE_COMMUNITY,
  CHANGE_STATE_FAVORITE_COMMUNITY
} from "./Types";

export const setFavorite = (payload) => {
  return {
    type: SET_FAVORITE_COMMUNITY,
    payload: payload,
  };
};

export const addFavorite = (payload) => {
  return {
    type: ADD_FAVORITE_COMMUNITY,
    payload: payload,
  };
};

export const removeFavorite = (payload) => {
  return {
    type: REMOVE_FAVORITE_COMMUNITY,
    payload: payload,
  };
};

export const changeStateFavorite = (payload) => {
  return {
    type: CHANGE_STATE_FAVORITE_COMMUNITY,
    payload: payload,
  };
};