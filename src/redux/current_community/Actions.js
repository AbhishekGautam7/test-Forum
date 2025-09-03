import {
  SET_CURRENT_COMMUNITY,
  CHANGE_CURRENT_COMMUNITY_STATE,
  SET_COMMUNITY_USERS,ADD_COMMUNITY_USERS, CHANGE_COMMUNITY_DESCRIPTION
} from "./Types";

export const setCurrentCommunity = (payload) => {
  return {
    type: SET_CURRENT_COMMUNITY,
    payload: payload,
  };
};
export const changeCurrentCommunityState = (payload) => {
  return {
    type: CHANGE_CURRENT_COMMUNITY_STATE,
    payload: payload,
  };
};
export const setCommunityUsers = (payload) => {
  return {
    type: SET_COMMUNITY_USERS,
    payload: payload,
  };
};

export const addCommunityUsers = (payload) => {
  return {
    type: ADD_COMMUNITY_USERS,
    payload: payload,
  };
};

export const changeCommunityDesc = (payload) => {
  return {
    type: CHANGE_COMMUNITY_DESCRIPTION,
    payload: payload,
  };
};

