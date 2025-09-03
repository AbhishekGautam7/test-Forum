import axios from "axios";
import { addUsersDetails, convertUsersAllDetail } from "./community";
// require("dotenv").config();

const AUTHORIZATION = process.env.REACT_APP_AUTHORIZATION;
const ORGADMIN_AUTHORIZATION = process.env.REACT_APP_ORGADMIN_AUTHORIZATION;
const AUTHENTICATION = process.env.REACT_APP_AUTHENTICATION;
const API_URL = process.env.REACT_APP_API_URL;
const MYCONNECT_API_URL = process.env.REACT_APP_MYCONNECT_API_URL;
const MYCONNECT_API_KEY = process.env.REACT_APP_MYCONNECT_API_KEY;
const cancelTokenSource = axios.CancelToken.source();
export const SITE_URL = process.env.REACT_APP_SITE_URL;
export const adminHeaders = (payload) => {
  return {
    Authorization: ORGADMIN_AUTHORIZATION,
    token: payload.token ? payload.token : "",
    appId: payload.appId ? payload.appId : "",
    "access-control-cllow-origin": "*",
  };
};
/*
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
*/
var cancelTokenGetAllCommunity;
export const getAllCommunity = (payload) => {
  console.log("getAllCommunity api call ...");

  if (typeof cancelToken1 != typeof undefined) {
    console.log("Operation canceled due to new request.");
    cancelTokenGetAllCommunity.cancel("Operation canceled due to new request.");
  }
  cancelTokenGetAllCommunity = axios.CancelToken.source();

  // let count = payload.count ? "&count=" + payload.count : "";

  let isLimit = payload.limit ? `&limit=${payload.limit}` : "";

  return axios
    .get(
      `${API_URL}/api/orgAdmin/community_list?deleted=${payload.deleted}${isLimit}`,
      {
        headers: adminHeaders(payload),
        cancelToken: cancelTokenGetAllCommunity.token,
      }
    )
    .then(async (response) => {
      if (response && response.data && response.data.data) {
        // return response.data.data;

        return addUsersDetails(response, payload);
      } else {
        return response;
      }
    })
    .catch((error) => error.response);
};

export const getTodaysCommunity = (payload) => {
  return axios
    .get(
      API_URL +
        "/api/orgAdmin/todays_community?currentDate=" +
        payload.currentDate,
      {
        headers: adminHeaders(payload),
      }
    )
    .then((response) => {
      return response;
    })
    .catch((error) => error.response);
};

export const fetchOrgFeeds = (payload) => {
  var communityParam = "";

  if (payload && payload.communityId) {
    communityParam = "&communityId=" + payload.communityId;
  }
  let last = payload.last ? "&last=" + payload.last : "";
  let count = payload.count ? payload.count : "20";
  return axios
    .get(
      API_URL +
        "/api/orgAdmin/fetch_feed?count=" +
        count +
        last +
        communityParam,

      {
        headers: adminHeaders(payload),
      }
    )
    .then(async (res) => {
      if (res.status === 200) {
        //return res;

        return {
          list: await convertUsersAllDetail(res, payload),
          metadata: res.data.metadata,
        };
      }
    })
    .catch((error) => error.response);
};

export const deletePostByAdmin = (payload) => {
  return axios
    .delete(API_URL + "/api/orgAdmin/delete_feed?feedId=" + payload.feedId, {
      headers: adminHeaders(payload),
    })
    .then((response) => {
      return response;
    })
    .catch((error) => error.response);
};

export const restorePostByAdmin = (payload) => {
  let url = API_URL + "/api/orgAdmin/restore_feed";

  let data = { feedId: payload.feedId };
  return axios
    .patch(url, data, {
      headers: adminHeaders(payload),
    })
    .then((response) => {
      return response;
    })
    .catch((error) => error.response);
};

export const editQuestionByAdmin = (payload) => {
  let url = API_URL + "/api/orgAdmin/edit_question";

  let data = {
    feedId: payload.feedId ? payload.feedId : null,
    question: payload.question ? payload.question : null,
    tags: payload.topics ? payload.topics : [],
    startDate: payload.startDate ? payload.startDate : null,
    endDate: payload.endDate ? payload.endDate : null,
    userIds: payload.userIds ? payload.userIds : [],
    attachments: payload.attachments ? payload.attachments : [],
    assignedLearningTopics: payload?.assignedLearningTopics
      ? payload.assignedLearningTopics
      : [],
  };

  return axios.put(url, data, {
    headers: adminHeaders(payload),
  });
};

export const editDiscussionByAdmin = (payload) => {
  let url = API_URL + "/api/orgAdmin/edit_discussion";

  let data = {
    feedId: payload.feedId ? payload.feedId : null,
    title: payload.title ? payload.title : null,
    description: payload.description ? payload.description : null,
    startDate: payload.startDate ? payload.startDate : null,
    endDate: payload.endDate ? payload.endDate : null,
    tags: payload.topics ? payload.topics : [],
    userIds: payload.userIds ? payload.userIds : [],
    attachments: payload.attachments ? payload.attachments : [],
    assignedLearningTopics: payload.assignedLearningTopics
      ? payload.assignedLearningTopics
      : [],
  };

  return axios.put(url, data, {
    headers: adminHeaders(payload),
  });
};

export const fetchDeletedFeeds = (payload) => {
  let last = payload.last ? "&last=" + payload.last : "";
  let count = payload.count ? "&count=" + payload.count : "&count=20";
  return axios
    .get(
      API_URL +
        "/api/orgAdmin/deleted_feeds?communityId=" +
        payload.communityId +
        last +
        count,
      {
        headers: adminHeaders(payload),
      }
    )
    .then(async (res) => {
      if (res.status === 200) {
        //return res;
        return {
          list: await convertUsersAllDetail(res, payload),
          metadata: res.data.metadata,
        };
      }
    })
    .catch((error) => error.response);
};

export const changeStateByAdmin = (payload) => {
  let url =
    API_URL +
    "/api/orgAdmin/community/change_state?communityId=" +
    payload.communityId;
  let data = {};

  return axios
    .patch(url, data, {
      headers: adminHeaders(payload),
    })
    .then((response) => {
      return response;
    })
    .catch((error) => error);
};

export const deleteCommunityByAdmin = (payload) => {
  let url =
    API_URL +
    "/api/orgAdmin/delete_community?communityId=" +
    payload.communityId;

  return axios
    .delete(url, {
      headers: adminHeaders(payload),
    })
    .then((response) => {
      return response;
    })
    .catch((error) => error.response);
};

export const editCommunityBannerByAdmin = (payload) => {
  let url = API_URL + "/api/orgAdmin/edit_bannerImage";

  let data = {
    bannerImage: payload.bannerImage,
    communityId: payload.communityId,
  };
  return axios
    .patch(url, data, {
      headers: adminHeaders(payload),
    })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.toJSON();
    });
};

export const editCommunityByAdmin = (payload) => {
  let url = API_URL + "/api/orgAdmin/edit_community";

  let data = {
    name: payload.name,
    description: payload.description,
    tagNames: payload.tagNames,
    state: payload.state,
    bannerImage: payload.bannerImage,
    communityId: payload.communityId,
  };

  return axios.put(url, data, {
    headers: adminHeaders(payload),
  });
};

export const editCommunityUserByAdmin = (payload) => {
  let url = API_URL + "/api/orgAdmin/edit_communityUser";
  let data = {
    communityId: payload.communityId,
    userIds: payload.userIds,
  };

  return axios
    .post(url, data, {
      headers: adminHeaders(payload),
    })
    .then((response) => {
      // console.log("edit user in community api response data :", response);
      return response;
    })
    .catch((error) => error.response);
};

export const addMemberToCommunityByAdmin = (payload) => {
  let url = API_URL + "/api/orgAdmin/user/add_to_community";
  let data = {
    communityId: payload.communityId,
    userIds: payload.userIds,
  };

  return axios
    .post(url, data, {
      headers: adminHeaders(payload),
    })
    .then((response) => {
      return response;
    })
    .catch((error) => error.response);
};
