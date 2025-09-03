import axios from "axios";
import { headers } from "./community";

export const getCommunityGroupList = (payload) => {
  let query = `communityId=${payload.communityId}&page=${payload.page}&limit=${payload.limit}`;

  if (payload.search) {
    query = query + `&searchKey=${payload.search}`;
  }
  return axios
    .get(process.env.REACT_APP_API_URL + `/api/group?` + query, {
      headers: headers(payload),
    })
    .then((response) => {
      return response;
    })
    .catch((error) => error.response);
};

export const getGroupMessages = (payload) => {
  let query = `communityId=${payload.communityId}&page=${payload.page}&limit=${payload.limit}`;

  return axios
    .get(
      process.env.REACT_APP_API_URL +
        `/api/group/${payload.groupId}/messages?` +
        query,
      {
        headers: headers(payload),
      }
    )
    .then((response) => {
      return response;
    })
    .catch((error) => error.response);
};

export const createGroup = (payload) => {
  let url = process.env.REACT_APP_API_URL + "/api/group";

  let data = {
    name: payload.name,
    includeAllUsers: payload.includeAllUsers,
    usersId: payload.usersId,
    communityId: payload.communityId,
  };

  return axios
    .post(url, data, {
      headers: headers(payload),
    })
    .then((response) => {
      return response;
    })
    .catch((error) => error.response);
};

export const createDefaultGroup = (payload) => {
  let url = process.env.REACT_APP_API_URL + "/api/group/default";

  let data = {
    communityId: payload.communityId,
  };

  return axios
    .post(url, data, {
      headers: headers(payload),
    })
    .then((response) => {
      return response;
    })
    .catch((error) => error.response);
};

export const updateGroup = (payload) => {
  let url =
    process.env.REACT_APP_API_URL + "/api/group/edit-config/" + payload.groupId;

  let data = {
    name: payload.name,
    canUserSendMessage: payload?.canUserSendMessage,
    canUserViewMessage: payload?.canUserViewMessage,
    allowReaction: payload?.allowReaction,
    canUserViewReaction: payload?.canUserViewReaction,
    allowComment: payload?.allowComment,
    canUserViewComment: payload?.canUserViewComment,
  };

  return axios
    .put(url, data, {
      headers: headers(payload),
    })
    .then((response) => {
      return response;
    })
    .catch((error) => error.response);
};

export const addOrRemoveGroupUsers = (payload) => {
  let url =
    process.env.REACT_APP_API_URL + "/api/group/edit-users/" + payload.groupId;

  let data = {
    newAddedUsers: payload.newAddedUsers,
    removedUsers: payload.removedUsers,
  };

  return axios
    .put(url, data, {
      headers: headers(payload),
    })
    .then((response) => {
      return response;
    })
    .catch((error) => error.response);
};
