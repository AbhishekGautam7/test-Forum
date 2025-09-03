import {
  SET_MY_COMMUNITY,
  ADD_MY_COMMUNITY,
  DELETE_MY_COMMUNITY,
  CHANGE_STATE_MY_COMMUNITY
} from "./Types";

export const setMyCommunity = (payload) => {
  return {
    type: SET_MY_COMMUNITY,
    payload: payload,
  };
};

export const addMyCommunity = (payload) => {
  return {
    type: ADD_MY_COMMUNITY,
    payload: payload,
  };
};

export const deleteMyCommunity = (payload) => {
  return {
    type: DELETE_MY_COMMUNITY,
    payload: payload,
  };
};

export const changeStateMyCommunity = (payload) => {
  return {
    type: CHANGE_STATE_MY_COMMUNITY,
    payload: payload,
  };
};

