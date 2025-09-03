import axios from "axios";
import { headers } from "./community";
const AUTHORIZATION = process.env.REACT_APP_AUTHORIZATION;
const API_URL = process.env.REACT_APP_API_URL;

export const createReply = (payload) => {
  let url = API_URL + "/api/feed/add-reply-to-comment";

  let data = {
    commentId: payload.commentId ? payload.commentId : "",
    reply : payload.reply ? payload.reply : "",
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

export const getReplyList = (payload) => {
  let url = API_URL + "/api/feed/reply-of-comment/" + payload.commentId;

  let data = {};
  return axios
    .post(url, data, {
      headers: headers(payload),
    })
    .then((response) => {
      return response;
    })
    .catch((error) => error.response);
};

export const toogleLikeComment = (payload) => {
  let url = API_URL + "/api/feed/like-unlike-to-comment";

  let data = {
    commentId: payload.commentId ? payload.commentId : "",
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
