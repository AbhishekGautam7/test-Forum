import axios from "axios";
// require("dotenv").config();

const MYCONNECT_API_URL = process.env.REACT_APP_MYCONNECT_API_URL;
const MYCONNECT_API_KEY = process.env.REACT_APP_MYCONNECT_API_KEY;
export const userAddedToCommunityEmail = (payload) => {
  let url =
    MYCONNECT_API_URL + "/community-forum-api/user-added-to-community-email";

  let headers = {
    apikey: MYCONNECT_API_KEY,
    token: payload.token ? payload.token : "",
  };
  let data = {
    user_ids: payload.userIds,
    community_name: payload.communityName,
    community_id: payload.communityId,
    type: payload.type || "",
  };
  return axios
    .post(url, data, {
      headers: headers,
    })
    .then((response) => {
      console.log(response);
      if (response.status === 200) {
        return response;
      } else if (response.status === 400) {
        return "sorry";
      } else {
        return "sorry....";
      }
    })
    .catch((error) => error.response);
};

export const joinCommunityEmail = (payload) => {
  let url =
    MYCONNECT_API_URL +
    "/community-forum-api/user-joined-public-community-email";

  let headers = {
    apikey: MYCONNECT_API_KEY,
    token: payload.token ? payload.token : "",
  };

  let data = {
    organisation_id: payload.orgId,
    user_id: payload.userId,
    community_name: payload.communityName,
    community_id: payload.communityId || "",
    type: payload.type || "",
  };
  return axios
    .post(url, data, {
      headers: headers,
    })
    .then((response) => {
      console.log(response);
      if (response.status === 200) {
        return response;
      } else if (response.status === 400) {
        return "sorry";
      } else {
        return "sorry....";
      }
    })
    .catch((error) => error.response);
};

export const addUserOnFeedEmail = (payload) => {
  let url =
    MYCONNECT_API_URL + "/community-forum-api/user-tagged-to-post-email";

  let headers = {
    apikey: MYCONNECT_API_KEY,
    token: payload.token ? payload.token : "",
  };

  let data = {
    user_ids: payload.userIds,
    community_name: payload.communityName,
    community_id: payload.communityId,
    post_title: payload.title,
    post_id: payload.communityFeedId || "",
    type: payload.type || "",
  };
  return axios
    .post(url, data, {
      headers: headers,
    })
    .then((response) => {
      console.log(response);
      if (response.status === 200) {
        return response;
      } else if (response.status === 400) {
        return "sorry";
      } else {
        return "sorry....";
      }
    })
    .catch((error) => error.response);
};
/*
"organisation_id":"5feab31d3fcfc401d96e1035",
*/
export const addUserOnScheduleFeedEmail = (payload) => {
  let url =
    MYCONNECT_API_URL +
    "/community-forum-api/user-tagged-to-scheduled-post-email";

  let headers = {
    apikey: MYCONNECT_API_KEY,
    token: payload.token ? payload.token : "",
  };

  let data = {
    user_ids: payload.userIds,
    community_id: payload.communityId || "",
    community_name: payload.communityName,
    post_title: payload.title,
    post_id: payload.communityFeedId || "",
    schedule_date: payload.scheduleDate,
    type: payload.type || "",
  };
  return axios
    .post(url, data, {
      headers: headers,
    })
    .then((response) => {
      console.log(response);
      if (response.status === 200) {
        return response;
      } else if (response.status === 400) {
        return "sorry";
      } else {
        return "sorry....";
      }
    })
    .catch((error) => error.response);
};
