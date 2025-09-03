import {
  SET_TODAYS_COMMUNITY,
  ADD_TODAYS_COMMUNITY,
  REMOVE_FROM_TODAYS_COMMUNITY,
  CHANGE_STATE_TODAYS_COMMUNITY
} from "./Types";

export const setTodaysCommunity = (payload) => {
  return {
    type: SET_TODAYS_COMMUNITY,
    payload: payload,
  };
};

export const addTodaysCommunity = (payload) => {
  return {
    type: ADD_TODAYS_COMMUNITY,
    payload: payload,
  };
};

export const removeFromTodaysCommunity = (payload) => {
  return {
    type: REMOVE_FROM_TODAYS_COMMUNITY,
    payload: payload,
  };
};

export const changeStateTodaysCommunity = (payload) => {
  return {
    type: CHANGE_STATE_TODAYS_COMMUNITY,
    payload: payload,
  };
};
