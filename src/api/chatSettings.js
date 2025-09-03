import axios from "axios";
import { headers } from "./community";

const API_URL = process.env.REACT_APP_API_URL?.replace(/\.$/, ""); // remove trailing dot if any

export const changeAdminChatSettings = (payload) => {
  const url = `${API_URL}/api/orgAdmin/chat-settings`;

  const { token, appId, ...rest } = payload;

  return axios.put(url, rest, {
    headers: headers({ token, appId }),
  });
};

export const getAdminChatSettings = (payload) => {
  const { token, appId, communityId } = payload;

  const url = `${API_URL}/api/community/chat-settings/${communityId}`;

  return axios.get(url, {
    headers: headers({ token, appId }),
  });
};

export const changeCommunityAdminChatSettings = (payload) => {
  const url = `${API_URL}/api/community/chat-settings`;

  const { token, appId, ...rest } = payload;

  return axios.put(url, rest, {
    headers: headers({ token, appId }),
  });
};
