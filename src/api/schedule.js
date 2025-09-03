import axios, { CancelToken } from "axios";
import { convertUsersAllDetail } from "./community";
import { headers } from "./community";
// require("dotenv").config();

const API_URL = process.env.REACT_APP_API_URL;

export const getAllScheduedPosts = (payload) => {
  if (payload && payload.communityId) {
    communityParam = "&communityId=" + payload.communityId;
  }

  var last = "";
  if (payload.last) {
    last = "&last=" + payload.last;
  }

  var communityParam = "";
  if (payload && payload.communityId) {
    communityParam = "&communityId=" + payload.communityId;
  }

  var count = payload.count ? "count=" + payload.count : "count=20";
  let url =
    API_URL + "/api/feed/scheduled_feeds?" + count + communityParam + last;

  return axios
    .get(url, {
      headers: headers(payload),
    })
    .then(async (response) => {
      return {
        list: await convertUsersAllDetail(response, payload),
        metadata: response.data.metadata,
      };
    })
    .catch((error) => error);
};

export const getPastFeeds = (payload) => {
  var communityParam = "";
  if (payload && payload.communityId) {
    communityParam = "&communityId=" + payload.communityId;
  }

  let count = payload.count ? "count=" + payload.count : "count=20";
  let last = payload.last ? "&last=" + payload.last : "";

  let url = API_URL + "/api/feed/past_feeds?" + count + communityParam + last;

  return axios
    .get(url, {
      headers: headers(payload),
    })
    .then(async (response) => {
      return {
        list: await convertUsersAllDetail(response, payload),
        metadata: response.data.metadata,
      };
    })
    .catch((error) => error);
};
