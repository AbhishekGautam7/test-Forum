import axios from "axios";

import { getAllFeed as getAllFeedAPI } from "./feed";
import { getUsersDetail as getUsersDetailAPI } from "./myconnect";
export { deleteComment, editComment } from "./comment.js";
export {
	convertUsersAllDetail,
	fileUploader,
	getMemberList,
	getUserDetail,
	getUsersDetail,
} from "./myconnect";
export { createReply, getReplyList, toogleLikeComment } from "./replyComment";
export {
	advanceSearchCommunity,
	advanceSearchConversations,
	getCommunityFeedByKeyword,
	getFeedByTag,
	getTopicsByKeyword,
	searchCommunityByKeyword,
} from "./search.js";
export {
	addUserOnFeedEmail,
	addUserOnScheduleFeedEmail,
	joinCommunityEmail,
	userAddedToCommunityEmail,
} from "./sendemail.js";

// require("dotenv").config();

const AUTHORIZATION = process.env.REACT_APP_AUTHORIZATION;
const API_URL = process.env.REACT_APP_API_URL;
const MYCONNECT_API_URL = process.env.REACT_APP_MYCONNECT_API_URL;

export const SITE_URL = process.env.REACT_APP_SITE_URL;

export {
	addDiscuss,
	addQuestion,
	deletePost,
	editDiscussionFeed,
	editQuestionFeed,
	getAllFeed,
	getSingleFeed,
} from "./feed";
console.log(
	"******************** Community Forum Version : 2.29 **************************"
);
export const setImg = (url) => {
	return SITE_URL + url;
};

export const headers = (payload) => {
	return {
		Authorization: AUTHORIZATION,
		token: payload.token ? payload.token : "notoken",
		appId: payload.appId ? payload.appId : "noappId",
		"access-control-cllow-origin": "*",
	};
};

export const getCommunityUserList = (payload) => {
	let query = `communityId=${payload.communityId}&page=${payload.page}&limit=${payload.limit}`;

	if (payload.groupId) {
		query = query + `&groupId=${payload.groupId}`;
	}

	if (payload.groupMembersOnly === true || payload.groupMembersOnly === false) {
		query = query + `&groupMembersOnly=${payload.groupMembersOnly}`;
	}

	return axios
		.get(API_URL + `/api/community/user/for-group?` + query, {
			headers: headers(payload),
		})
		.then((response) => {
			return response;
		})
		.catch((error) => error.response);
};

// clientId,tenentId,orgId,role,secretKey,userid
export const getPublicCommunityList = (payload) => {
	let count = payload.count ? "count=" + payload.count : "";

	return axios
		.get(API_URL + "/api/community/suggested_communities?" + count, {
			headers: headers(payload),
		})
		.then((response) => {
			return response;
		})
		.catch((error) => error.response);
};
export const addUsersDetails = (res, payload) => {
	if (res && res.data && res.data.data && res.data.data.length > 0) {
		let publicCommunityData = res.data.data.map((item) => {
			return {
				_id: item._id ? item._id : "",
				bannerImage: item.bannerImage ? item.bannerImage : "",
				name: item.name ? item.name : "",
				communityUsers: item.communityUsers ? item.communityUsers : [],
				description: item.description ? item.description : "",
				createdBy: item.createdBy ? item.createdBy : null,
				state: item.state,
			};
		});

		let users = [];
		publicCommunityData.map((item) => {
			users = [...users, ...item.communityUsers];
		});

		let usersSets = new Set(users);

		let uniqueUsers = Array.from(usersSets);

		return getUsersDetailAPI({
			userIds: uniqueUsers,
			token: payload.token,
		}).then((response) => {
			if (response.status === 200) {
				let usersDetails = response.data.data;

				let allPublicFeeds = publicCommunityData.map((item) => {
					let myitem = { ...item };

					myitem.communityUsers = myitem.communityUsers.map((commuser) => {
						return usersDetails.find((user) => user._id === commuser);
					});

					return myitem;
				});

				return allPublicFeeds;
			} else {
				return publicCommunityData;
			}
		});
		// dispatch(setPublicCommunity(publicCommunityData));
	} else {
		return res?.data?.data;
	}
};
export const getAllPublicCommunityList = (payload) => {
	let count = payload.count ? "count=" + payload.count : "count=10";

	return axios
		.get(API_URL + "/api/community/suggested_communities?" + count, {
			headers: headers(payload),
		})
		.then((res) => addUsersDetails(res, payload))
		.catch((error) => error.res);
};

export const leaveCommmunity = (payload) => {
	let url =
		API_URL +
		"/api/community/user/self_remove?communityId=" +
		payload.communityId;

	return axios
		.delete(url, {
			headers: headers(payload),
		})
		.then((response) => {
			// return response;
			// return convertUsersAllDetail(response, payload);
			return getAllFeedAPI().then((response) => {
				return response;
			});
		})
		.catch((error) => error.response);
};

export const changeCommunityState = (payload) => {
	let url =
		API_URL + "/api/community/change_state?communityId=" + payload.communityId;
	let data = {};

	return axios
		.patch(url, data, {
			headers: headers(payload),
		})
		.then((response) => {
			return response;
		})
		.catch((error) => error);
};
// export { getFeedByTag, searchCommunityByKeyword } from "./search.js";
/*
export const getFeedList = (payload) => {
    var communityParam = "";
    if (payload && payload.communityId) {
        communityParam = "&communityId=" + payload.communityId;
    }

    let url =
        API_URL +
        "/api/community/fetch_feed?organizationId=" +
        payload.orgId +
        "&tenentId=" +
        payload.tenentId +
        "&userId=" +
        payload.userId +
        "&clientId=" +
        payload.clientId +
        communityParam + "&count=20&page=2";
  
    return axios
        .get(url, {
            headers: headers(payload),
        })
        .then((response) => {
            return response;
        })
        .catch((error) => error.response);
};
*/

export const editCommunityBanner = (payload) => {
	let url =
		API_URL +
		"/api/community/edit_bannerImage?communityId=" +
		payload.communityId;

	let data = {
		bannerImage: payload.bannerImage,
		communityId: payload.communityId,
	};
	return axios
		.patch(url, data, {
			headers: headers(payload),
		})
		.then((response) => {
			return response;
		})
		.catch((error) => {
			return error.toJSON();
		});
};

export const editCommunity = (payload) => {
	let url = API_URL + "/api/community/edit?communityId=" + payload.communityId;

	let data = {
		name: payload.name,
		description: payload.description,
		tagNames: payload.tagNames,
		state: payload.state,
		bannerImage: payload.bannerImage,
		communityId: payload.communityId,
	};

	return axios.put(url, data, {
		headers: headers(payload),
	});
};

export const createNewCommunity = (payload) => {
	let url = API_URL + "/api/community/add";

	let data = {
		name: payload.name ? payload.name : "",
		description: payload.description ? payload.description : "",
		tagNames: payload.tagNames ? payload.tagNames : "",
		isFeatured: payload.isFeatured ? payload.isFeatured : true,
		state: payload.isPrivate ? "Private" : "Public",
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

export const addMemberToCommunity = (payload) => {
	let url = API_URL + "/api/community/user/add_to_community";
	let data = {
		communityId: payload.communityId,
		userIds: payload.userIds,
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

export const editMembersToCommunity = (payload) => {
	let url = API_URL + "/api/community/user/edit_communityUser";
	let data = {
		communityId: payload.communityId,
		userIds: payload.userIds,
		addedBy: payload.userId,
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
export const deleteCommunity = (payload) => {
	let url =
		API_URL + "/api/community/delete?communityId=" + payload.communityId;

	return axios
		.delete(url, {
			headers: headers(payload),
		})
		.then((response) => {
			return response;
		})
		.catch((error) => error.response);
};

export const setFavoriteCommunity = (payload) => {
	let url = API_URL + "/api/community/set_favourite";
	let data = {
		communityId: payload.communityId,
		createdBy: payload.createdBy,
	};

	return axios
		.patch(url, data, {
			headers: headers(payload),
		})
		.then((response) => {
			return response;
		})
		.catch((error) => error.response);
};

export const joinCommunityAPI = (payload) => {
	let url = API_URL + "/api/community/user/join_public";

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
		.catch((error) => {
			return error.response;
		});
};

export const getMyCommunityList = (payload) => {
	return axios
		.get(API_URL + "/api/community/user/mycommunity", {
			headers: headers(payload),
		})
		.then((response) => {
			if (response && response.data && response.data.data) {
				return response.data.data;
			} else {
				return response;
			}
		})
		.catch((error) => error.response);
};
export const getCommunityDetail = (payload) => {
	let url =
		API_URL + "/api/community/details?communityId=" + payload.communityId;

	return axios
		.get(url, {
			headers: headers(payload),
		})
		.then((response) => response)
		.catch((error) => error.response);
};
export const getFavoriteCommunityList = (payload) => {
	let url = API_URL + "/api/community/get_favourite";

	return axios
		.get(url, {
			headers: headers(payload),
		})
		.then((response) => response)
		.catch((error) => error.response);
};

export const editCommunityDescription = (payload) => {
	let url = API_URL + "/api/community/add_description";
	let data = {
		description: payload.desc,
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

export const getCommunityList = (payload) => {
	let query = `page=${payload.page}&limit=${payload.limit}`;

	if (payload.search) {
		query = query + `&search=${payload.search}`;
	}

	if (payload.isFavourite) {
		query = query + `&isFavourite=${payload.isFavourite}`;
	}

	if (payload.state) {
		query = query + `&state=${payload.state}`;
	}

	if (payload.isCreator) {
		query = query + `&isCreator=${payload.isCreator}`;
	}

	if (payload.isJoined) {
		query = query + `&isJoined=${payload.isJoined}`;
	}

	return axios
		.get(API_URL + `/api/community/user/my-community?` + query, {
			headers: headers(payload),
		})
		.then((response) => {
			return response;
		})
		.catch((error) => error.response);
};

export const getCommunityListForChat = (payload) => {
	let query = `page=${payload.page}&onlyChatEnabled=true`;

	if (payload.search) {
		query = query + `&search=${payload.search}`;
	}

	return axios
		.get(API_URL + `/api/community/user/my-community?` + query, {
			headers: headers(payload),
		})
		.then((response) => {
			return response;
		})
		.catch((error) => error.response);
};

export const API = "community";
