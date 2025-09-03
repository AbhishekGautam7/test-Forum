import axios from "axios";
import { headers } from "./community";

const API_URL = process.env.REACT_APP_API_URL;

// api/feed/edit_comment
export const editComment = (payload) => {
  let url = API_URL + "/api/feed/edit_comment";

  let data = {
    commentId: payload.commentId,
    comment: payload.comment,
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

export const deleteComment = (payload) => {
  let url = API_URL + "/api/feed/delete_comment?commentId=" + payload.commentId;

  return axios
    .delete(url, {
      headers: headers(payload),
    })
    .then((response) => {
      return response;
    })
    .catch((error) => error.response);
};
