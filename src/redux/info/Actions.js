import {
  SET_LOADING,
  SET_BOX,
  SET_CREATE_COMMUNITY_STATUS,
  SET_EDIT_COMMUNITY_STATUS,
  SET_MODAL,
  SET_POST,
  SET_PAGE,
  SET_USER_ID,
  SET_ORG_ID,
  SET_COMMUNITY_ID,
  SET_CLIENT_ID,
  SET_TENENT_ID,
  SET_SECRET_KEY,
  SET_APP_ID,
  SET_INVITE_USERS_STATUS,
  SET_COMMUNITY_HEADER_TAB,
  SET_TAG,
  SET_CURRENT_FEED_ID,
  SET_TOKEN,
} from "./Types";

export const setLoading = (payload) => {
  return {
    type: SET_LOADING,
    payload: payload,
  };
};
export const setBox = (payload) => {
  return {
    type: SET_BOX,
    payload: payload,
  };
};

export const setStatusCreateCommunity = (payload) => {
  return {
    type: SET_CREATE_COMMUNITY_STATUS,
    payload: payload,
  };
};
export const setEditCommunityStatus = (payload) => {
  return {
    type: SET_EDIT_COMMUNITY_STATUS,
    payload: payload,
  };
};

export const setModal = (payload) => {
  return {
    type: SET_MODAL,
    payload: payload,
  };
};

export const setPost = (payload) => {
  return {
    type: SET_POST,
    payload: payload,
  };
};
export const setPage = (payload) => {
  return {
    type: SET_PAGE,
    payload: payload,
  };
};
export const setUserId = (payload) => {
  return {
    type: SET_USER_ID,
    payload: payload,
  };
};
export const setOrgId = (payload) => {
  return {
    type: SET_ORG_ID,
    payload: payload,
  };
};
export const setToken = (payload) => {
  return {
    type: SET_TOKEN,
    payload: payload,
  };
};
export const setCommunityId = (payload) => {
  return {
    type: SET_COMMUNITY_ID,
    payload: payload,
  };
};
export const setClientId = (payload) => {
  return {
    type: SET_CLIENT_ID,
    payload: payload,
  };
};
export const setTenentId = (payload) => {
  return {
    type: SET_TENENT_ID,
    payload: payload,
  };
};
export const setSecretKey = (payload) => {
  return {
    type: SET_SECRET_KEY,
    payload: payload,
  };
};
export const setAppId = (payload) => {
  return {
    type: SET_APP_ID,
    payload: payload,
  };
};
export const setInviteUsersStatus = (payload) => {
  return {
    type: SET_INVITE_USERS_STATUS,
    payload: payload,
  };
};
export const setCommuinityHeaderTab = (payload) => {
  return {
    type: SET_COMMUNITY_HEADER_TAB,
    payload: payload ? payload : "conversations",
  };
};
export const setTag = (payload) => {
  return {
    type: SET_TAG,
    payload: payload ? payload : "",
  };
};
export const setCurrentFeedId = (payload) => {
  return {
    type: SET_CURRENT_FEED_ID,
    payload: payload ? payload : "",
  };
};
