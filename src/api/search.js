import axios from "axios";

import { convertUsersAllDetail, getUsersDetail } from "./community";
import { headers } from "./community";
// require("dotenv").config();
const AUTHORIZATION = process.env.REACT_APP_AUTHORIZATION;
const API_URL = process.env.REACT_APP_API_URL;
var cancelToken;
var cancelToken1;
export const getFeedByTag = (payload) => {
  console.log(payload);
  var communityParam = "";
  var statusParam = "";

  if (payload && payload.communityId) {
    communityParam = "&communityId=" + payload.communityId;
  }

  if (payload && payload.status) {
    statusParam = "&status=" + payload.status;
  } else {
    statusParam = "&status=live";
  }
  var last = payload.last ? "&last=" + payload.last : "";

  let url =
    API_URL +
    "/api/feed/search/tag_search?keyword=" +
    payload.keyword +
    communityParam +
    statusParam +
    last;

  let data = {};
  if (payload && payload.communityId) {
    data.communityId = payload.communityId;
  }
  return axios
    .get(url, {
      headers: headers(payload),
    })
    .then(async (response) => {
      // return response;

      return {
        list: await convertUsersAllDetail(response, payload),
        metadata: response.data.metadata,
      };
    })
    .catch((error) => error.response);
};

export const searchCommunityByKeyword = (payload) => {
  console.log(payload, cancelToken1);

  if (typeof cancelToken1 != typeof undefined) {
    console.log("Operation canceled due to new request.");
    cancelToken1.cancel("Operation canceled due to new request.");
  }
  cancelToken1 = axios.CancelToken.source();

  let url =
    API_URL + "/api/community/search/mycommunity?keyword=" + payload.keyword;

  return axios
    .get(url, {
      headers: headers(payload),
      cancelToken: cancelToken1.token,
    })
    .then(async (response) => {
      // return response;
      return response;
    })
    .catch((error) => error.response);
};
var advanceSearchConversationsCancelToken;
export const advanceSearchConversations = (payload) => {
  if (typeof advanceSearchConversationsCancelToken != typeof undefined) {
    console.log("Operation canceled due to new request.");
    advanceSearchConversationsCancelToken.cancel(
      "Operation canceled due to new request."
    );
  }

  advanceSearchConversationsCancelToken = axios.CancelToken.source();

  let status = "";
  console.log(payload);
  let count = payload.count ? "&count=" + payload.count : "";
  status = payload.status ? "&status=" + payload.status : "";
  let last = payload.last ? "&last=" + payload.last : "";
  let fromParam = "";
  let toParam = "";
  let communityIdParam = "";
  if (payload.from) {
    fromParam = "&from=" + payload.from;
  }
  if (payload.to) {
    toParam = "&to=" + payload.to;
  }
  if (payload.communityId) {
    communityIdParam = "&communityId=" + payload.communityId;
  }
  let url =
    API_URL +
    "/api/community/search/advanced/conversation?keyword=" +
    payload.keyword +
    fromParam +
    toParam +
    communityIdParam +
    count +
    last +
    status;

  let headers = {
    authorization: AUTHORIZATION,
    cancelToken: advanceSearchConversationsCancelToken.token,
    token: payload.token ? payload.token : "",
    appId: payload.appId ? payload.appId : "",
    "access-control-allow-origin": "*",
  };
  return axios
    .get(url, {
      headers: headers,
    })
    .then(async (response) => {
      // return response;
      if (response.data.data.length === 0) {
        return {
          list: [],
          metadata: response.data.metadata,
        };
      } else {
        return {
          list: await convertUsersAllDetail(response, payload),
          metadata: response.data.metadata,
        };
      }
    })
    .catch((error) => error.response);
};
export const convertUserIdsToUserDetails = (data, payload) => {
  let allIds = [];
  let userList = [...data];
  userList.map((item) => item.communityUsers.map((user) => allIds.push(user)));
  let usersSets = new Set(allIds);

  return getUsersDetail({
    userIds: Array.from(usersSets),
    token: payload.token,
  }).then((res) => {
    if (res.status === 200) {
      let allUsersDetails = res.data.data;
      let userDetailList = userList.map((mydata) =>
        mydata.communityUsers.map((user) =>
          allUsersDetails.find((aa) => aa._id === user)
        )
      );
      userList.forEach((item, index) => {
        userList[index].communityUsers = userDetailList[index];
      });
      return userList;
    }
  });
};
var advanceSearchCommunityCancelToken;
export const advanceSearchCommunity = (payload) => {
  if (typeof advanceSearchCommunityCancelToken != typeof undefined) {
    console.log("Operation canceled due to new request.");
    advanceSearchCommunityCancelToken.cancel(
      "Operation canceled due to new request."
    );
  }
  advanceSearchCommunityCancelToken = axios.CancelToken.source();

  let fromParam = "";
  let toParam = "";
  if (payload.from) {
    fromParam = "&from=" + payload.from;
  }
  if (payload.to) {
    toParam = "&to=" + payload.to;
  }
  let url =
    API_URL +
    "/api/community/search/advanced/community?keyword=" +
    payload?.keyword +
    fromParam +
    toParam;

  return axios
    .get(url, {
      headers: headers(payload),
      cancelToken: advanceSearchCommunityCancelToken.token,
    })
    .then((response) => {
      // return response;
      if (response.data.data.length === 0) {
        return [];
      } else {
        return convertUserIdsToUserDetails(response.data.data, payload);
      }
    })
    .catch((error) => error.response);
};
export const getCommunityFeedByKeyword = (payload) => {
  console.log(payload);
  let count = payload.count ? "&count=" + payload.count : "";
  let last = payload.last ? "&last=" + payload.last : "";

  let status = payload.status ? "&status=" + payload.status : "";

  let url =
    API_URL +
    "/api/feed/search/conversation?keyword=" +
    payload.keyword +
    count +
    last +
    status;

  return axios
    .get(url, {
      headers: headers(payload),
    })
    .then(async (response) => {
      // return response;
      return {
        list: await convertUsersAllDetail(response, payload),
        metadata: response.data.metadata,
      };
    })
    .catch((error) => error.response);
};

export const getTopicsByKeyword = (payload) => {
  console.log("getTopicsByKeyword");
  if (typeof cancelToken != typeof undefined) {
    cancelToken.cancel("Operation canceled due to new request.");
  }

  //Save the cancel token for the current request

  cancelToken = axios.CancelToken.source();
  let status = "";
  if (payload.status) {
    status = "&status=" + payload.status;
  }
  let url =
    API_URL + "/api/feed/search/topic?keyword=" + payload.keyword + status;

  return axios
    .get(url, {
      headers: headers(payload),
      cancelToken: cancelToken.token,
    })
    .then((response) => {
      // return response;

      return response;
    })
    .catch((error) => error.response);
};
