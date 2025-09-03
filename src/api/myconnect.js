import axios from "axios";
const MYCONNECT_API_URL = process.env.REACT_APP_MYCONNECT_API_URL;
const MYCONNECT_API_KEY = process.env.REACT_APP_MYCONNECT_API_KEY;

//generate video thumbnail
export const generateVideoThumbnail = (file) => {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    video.preload = "metadata";
    video.src = URL.createObjectURL(file);

    video.onloadeddata = () => {
      video.currentTime = Math.floor(video.duration / 2); // Seek to the middle of the video
    };

    video.onseeked = () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      canvas.toBlob(
        (blob) => {
          resolve(blob);
        },
        "image/jpeg",
        0.75 // Quality
      );
    };

    video.onerror = (error) => {
      reject(error);
    };
  });
};
export const fileUploader = async (files) => {
  try {
    let thumbnailFile;
    if (files.type.startsWith("video")) {
      const thumbnailBlob = await generateVideoThumbnail(files);
      const originalName = files.name.split(".")[0];
      const timestamp = Date.now();
      const uniqueFileName = `${originalName}-${timestamp}-thumbnail.jpg`;
      thumbnailFile = new File([thumbnailBlob], uniqueFileName, {
        type: "image/jpeg",
      });
    }

    let formData = new FormData();
    formData.append("fileToSend", files);
    if (thumbnailFile) {
      formData.append("thumbnail", thumbnailFile);
    }
    formData.append("client", "BT101");
    formData.append("bucket", "community-forum-sandbox/webview");

    const UPLOADER = `https://awsuploader.services.olive.media`;
    axios.defaults.headers.post["Content-Type"] = "multipart/form-data";
    axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";
    axios.defaults.headers.post["Access-Control-Allow-Headers"] =
      "Origin, X-Requested-With, Content-Type, Accept";
    axios.defaults.headers.post["Content-Type"] = "multipart/form-data";

    return axios
      .post(`${UPLOADER}/upload`, formData)
      .then((res) => res)
      .catch((error) => error);
  } catch (error) {
    if (error.response) {
      console.error("error in uploader res", error);
    } else {
      console.error("504 error", error);
    }

    return error;
  }
};
export const getUserDetail = (payload) => {
  let url = MYCONNECT_API_URL + "/community-forum-api/user-detail";

  let headers = {
    apikey: MYCONNECT_API_KEY,
    token: payload.token ? payload.token : "",
  };
  let data = {};
  return new Promise((resolve, reject) => {
    return axios
      .post(url, data, {
        headers: headers,
      })
      .then((response) => {
        if (response.status === 200) {
          resolve(response);
        }
      })
      .catch((error) => reject(error.response));
  });
};
export const getLearningTopics = (payload) => {
  let url = `${MYCONNECT_API_URL}/community-forum-api/learning-topics?$limit=${payload.params.limit}&page_number=${payload.params.page_number}&search_key=${payload.params.search_key}`;

  let headers = {
    apikey: MYCONNECT_API_KEY,
    token: payload.token ? payload.token : "",
  };
  let data = {
    organisation_id: payload?.orgId,
  };
  return new Promise((resolve, reject) => {
    return axios
      .post(url, data, {
        headers: headers,
      })
      .then((response) => {
        if (response.status === 200) {
          resolve(response);
        }
      })
      .catch((error) => reject(error.response));
  });
};
export const getMemberList = (payload) => {
  let url =
    MYCONNECT_API_URL + "/community-forum-api/all-users-by-organisation";
  let headers = {
    apikey: MYCONNECT_API_KEY,
    token: payload.token ? payload.token : "",
  };
  let data = {
    pageNumber: 1,
    perPage: payload && payload.total ? payload.total : 30,
  };
  if (payload && payload.name) {
    data.name = payload.name;
  }

  return axios
    .post(url, data, {
      headers: headers,
    })
    .then((response) => {
      if (response && response.data && response.data.data) {
        return response.data.data.map((item) => {
          return {
            id: item._id,
            _id: item._id,
            name: item.firstName + " " + item.lastName,
            img: item.profilePic,
            email: item.email,
          };
        });
      } else {
        return [];
      }
    })
    .catch((error) => error.response);
};
export const getUsersDetail = (payload) => {
  let url = MYCONNECT_API_URL + "/community-forum-api/user-by-ids?";

  let headers = {
    apikey: MYCONNECT_API_KEY,
    token: payload.token ? payload.token : "",
  };

  let userIds =
    payload.userIds &&
    payload.userIds.length > 0 &&
    payload.userIds.map((item) => (item?._id ? item._id : item));
  let data = {
    user_ids: userIds || [payload?.userIds?._id],
    search_key: payload.search,
  };
  return axios
    .post(url, data, {
      headers: headers,
    })
    .then((response) => {
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

export const convertUsersAllDetail = (res, payload) => {
  let feedData = [...res.data.data];
  let users = feedData.map((item) => item.createdBy);

  /* Setting Contents */
  let datas = feedData.map((item) => {
    let obj = { ...item };
    obj.contents = JSON.parse(obj.content);

    return obj;
  });

  /* Add userIds */

  datas.forEach((item) => {
    if (
      item &&
      item.contents &&
      item.contents.userIds &&
      item.contents.userIds.length > 0
    ) {
      users = [...users, ...item.contents.userIds];
    }
  });

  let usersSets = new Set(users);

  let uniqueUsers = Array.from(usersSets);
  if (uniqueUsers.length === 0) {
    return [];
  }
  return getUsersDetail({
    userIds: uniqueUsers,
    token: payload.token ? payload.token : "",
  }).then((response) => {
    if (response.status === 200) {
      let usersDetails = response.data.data;
      let allDetailFeeds = datas.map((item) => {
        let myitem = { ...item };
        myitem.info = usersDetails.find(
          (item) => item._id === myitem.createdBy
        );

        // Fill Tag Users Detail
        if (
          myitem &&
          myitem.contents &&
          myitem.contents.userIds &&
          myitem.contents.userIds.length > 0
        ) {
          let usersDetail = myitem.contents.userIds.map((userId) => {
            return usersDetails.find((item) => item._id === userId);
          });
          myitem.contents.usersDetails = usersDetail;
        }

        return myitem;
      });
      return allDetailFeeds;
    }
  });
};
