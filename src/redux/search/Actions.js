import {
  SET_SEARCH_KEYWORD,
  SET_SEARCH_COMMUNITY_LIST,
  SET_SEARCH_MEMBER_LIST,
  SET_SEARCH_ATTACHMENT_LIST,
  SET_SEARCH_TAB,
  SET_LOAD_SEARCH_RESULT,
  SET_SEARCH_TYPE,
  SET_SEARCH_TOPICS,
  SET_SEARCH_TO,
  SET_SEARCH_FROM,
  SET_COMMUNITY_ID
} from "./Types";

export const setSearchKeyword = (payload) => {
  return {
    type: SET_SEARCH_KEYWORD,
    payload: payload,
  };
};
export const setSearchCommunityList = (payload) => {
  return {
    type: SET_SEARCH_COMMUNITY_LIST,
    payload: payload,
  };
};
export const setSearchMemberList = (payload) => {
  return {
    type: SET_SEARCH_MEMBER_LIST,
    payload: payload,
  };
};
export const setSearchAttachmentList = (payload) => {
  return {
    type: SET_SEARCH_ATTACHMENT_LIST,
    payload: payload,
  };
};
export const setSearchTab = (payload) => {
  return {
    type: SET_SEARCH_TAB,
    payload: payload,
  };
};
export const setLoadSearchResult = (payload) => {
  return {
    type: SET_LOAD_SEARCH_RESULT,
    payload: payload,
  };
};
export const setSearchType = (payload) => {
  return {
    type: SET_SEARCH_TYPE,
    payload: payload,
  };
};
export const setSearchTopics = (payload) => {
  return {
    type: SET_SEARCH_TOPICS,
    payload: payload,
  };
};

export const setSearchTo = (payload) => {
  return {
    type: SET_SEARCH_TO,
    payload: payload,
  };
};

export const setSearchFrom = (payload) => {
  return {
    type: SET_SEARCH_FROM,
    payload: payload,
  };
};

export const setSearchCommunityId = (payload) => {
  return {
    type: SET_COMMUNITY_ID,
    payload: payload,
  };
};





