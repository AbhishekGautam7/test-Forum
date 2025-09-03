import axios from "axios";

import { getUsersDetail, convertUsersAllDetail, headers } from "./community";
const AUTHORIZATION = process.env.REACT_APP_AUTHORIZATION;
const API_URL = process.env.REACT_APP_API_URL;
export const addComment = (payload) => {
  let url = API_URL + "/api/feed/add_comment";
  let data = {
    feedId: payload.feedId,
    comment: payload.comment,
  };

  return axios
    .post(url, data, {
      headers: headers(payload),
    })
    .then((response) => {
      return response;
    })
    .catch((error) => error);
};

export const getCommentList = (payload) => {
  console.log("getCommentList :", payload);
  /*
   feedId:feed._id,
      commentCount:commentCount,
      orgId:orgId
  */
  let commentCount = "";
  if (payload.commentCount) {
    commentCount = "&count=" + payload.commentCount;
  }

  console.log(payload);
  let url =
    API_URL + "/api/feed/comment_list?feedId=" + payload.feedId + commentCount;

  return axios
    .get(url, {
      headers: headers(payload),
    })
    .then((response) => {
      let data = response.data.data;
      let users = data.map((item) => item.userId);
      let usersSets = new Set(users);
      let uniqueUsers = Array.from(usersSets);

      //
      return getUsersDetail({
        userIds: uniqueUsers,
        token: payload.token,
      })
        .then((res) => {
          console.log("getUsersDetail", res, data);
          return data.map((item) => {
            let myitem = { ...item };
            myitem.userDetail = res.data.data.find(
              (user) => user._id === myitem.userId
            );
            return myitem;
          });
        })
        .catch((error) => error.res);
    })
    .catch((error) => error);
};

export const likePost = (payload) => {
  let url = API_URL + "/api/feed/like_post";

  let data = {
    feedId: payload.feedId,
  };

  return axios
    .post(url, data, {
      headers: headers(payload),
    })
    .then((response) => {
      return response;
    })
    .catch((error) => error);
};

export const getSingleFeed = (payload) => {
  let url = API_URL + "/api/feed/single_feed?feedId=" + payload.feedId;

  return axios
    .get(url, {
      headers: headers(payload),
    })
    .then((response) => {
      console.log(response.data.data);
      let res = {
        data: {
          data: [response.data.data],
        },
      };
      return convertUsersAllDetail(res, payload);
    })
    .catch((error) => error);
};

export const getAllFeed = (payload) => {
  var communityParam = payload.communityId
    ? "&communityId=" + payload.communityId
    : "";
  var countParam = payload.count ? "count=" + payload.count : "count=20";
  if (payload && payload.communityId) {
    communityParam = "&communityId=" + payload.communityId;
  }

  var page = "&page=1";
  if (payload.page) {
    page = "&page=" + payload.page;
  }

  var last = "";
  if (payload.last) {
    last = "&last=" + payload.last;
  }

  let url =
    API_URL + "/api/community/fetch_feed?" + countParam + communityParam + last;

  return axios
    .get(url, {
      headers: headers(payload),
    })
    .then(async (res) => {
      if (res.status === 200) {
        return {
          list: await convertUsersAllDetail(res, payload),
          metadata: res.data.metadata,
        };
      }
      //return response;
    })
    .catch((error) => error.response);
};

export const deletePost = (payload) => {
  let url = API_URL + "/api/feed/delete?feedId=" + payload.feedId;

  return axios
    .delete(url, {
      headers: headers(payload),
    })
    .then((response) => {
      return response;
    })
    .catch((error) => error.response);
};
export const addQuestion = (payload) => {
  let url = API_URL + "/api/community/question/add";

  let data = {
    question: payload.question ? payload.question : "",
    communityId: payload.communityId ? payload.communityId : null,
    tags: payload.topics ? payload.topics : [],
    userIds: payload.userIds ? payload.userIds : [],
    startDate: payload.startDate ? payload.startDate : "",
    endDate: payload.endDate,
    attachments: payload.attachments,
    assignedLearningTopics: payload?.assignedLearningTopics || [],
  };

  return axios
    .post(url, data, {
      headers: headers(payload),
    })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
};
export const addDiscuss = (payload) => {
  let url = API_URL + "/api/community/discussion/add";

  let data = {
    title: payload.title ? payload.title : "",
    description: payload.description ? payload.description : "",
    startDate: payload.startDate ? payload.startDate : "",
    endDate: payload.endDate ? payload.endDate : "",
    communityId: payload.communityId ? payload.communityId : null,
    tags: payload.topics ? payload.topics : [],
    userIds: payload.userIds ? payload.userIds : [],
    attachments: payload.attachments,
    assignedLearningTopics: payload?.assignedLearningTopics || [],
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

export const editQuestionFeed = (payload) => {
  let url = API_URL + "/api/community/question/edit";

  let data = {
    feedId: payload.feedId ? payload.feedId : null,
    question: payload.question ? payload.question : null,
    tags: payload.topics ? payload.topics : [],
    userIds: payload.userIds ? payload.userIds : [],
    attachments: payload.attachments ? payload.attachments : [],
    assignedLearningTopics: payload?.assignedLearningTopics || [],
  };
  if (payload.startDate) {
    data.startDate = payload.startDate;
  }
  if (payload.endDate) {
    data.endDate = payload.endDate;
  }

  return axios.put(url, data, {
    headers: headers(payload),
  });
};

export const editDiscussionFeed = (payload) => {
  let url = API_URL + "/api/community/discussion/edit";

  let data = {
    feedId: payload.feedId ? payload.feedId : null,
    title: payload.title ? payload.title : null,
    description: payload.description ? payload.description : null,
    tags: payload.topics ? payload.topics : [],
    userIds: payload.userIds ? payload.userIds : [],
    attachments: payload.attachments ? payload.attachments : [],
    assignedLearningTopics: payload?.assignedLearningTopics || [],
  };
  if (payload.startDate) {
    data.startDate = payload.startDate;
  }
  if (payload.endDate) {
    data.endDate = payload.endDate;
  }

  return axios.put(url, data, {
    headers: headers(payload),
  });
};
