import {
  CREATE_COMMUNITY,
  CHANGE_COMMUNITY_NAME,
  CHANGE_COMMUNITY_DESCRIPTION,
  TOGGLE_PRIVATE_STATUS,
  CHANGE_START_DATE,
  CHANGE_END_DATE,
  SET_PRIVATE_STATUS
} from "./Types";

export const createCommunity = () => {
  return {
    type: CREATE_COMMUNITY,
  };
};

export const changeCommunityName = (payload) => {
  return {
    type: CHANGE_COMMUNITY_NAME,
    payload: payload,
  };
};

export const changeCommunityDescription = (payload) => {
  return {
    type: CHANGE_COMMUNITY_DESCRIPTION,
    payload: payload,
  };
};

export const setPrivateStatus = () => {
  return {
    type: SET_PRIVATE_STATUS,
  };
};

export const togglePrivateStatus = () => {
  return {
    type: TOGGLE_PRIVATE_STATUS,
  };
};

export const changeStartDate = (payload) => {
  return {
    type: CHANGE_START_DATE,
    payload: payload,
  };
};


export const changeEndDate = (payload) => {
  return {
    type: CHANGE_END_DATE,
    payload: payload,
  };
};

