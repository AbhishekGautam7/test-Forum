import {
	SET_FEED_USERS,
	SET_FEEDS,
	SET_FEED_MODE,
	ADD_FEED,
	SET_COMMENT_STATUS,
	SET_COMMENT_COUNT,
	SET_FEED,
	DELETE_FEEDS_BY_COMMUNITY_ID,
	DELETE_ALL_POST,
	DELETE_FEED_BY_ID,
	DELETE_FEED_BY_ADMIN,
	RESTORE_FEED_BY_ADMIN,
	SET_FEEDS_NAME,
	REMOVE_LAST_FEED,
	HAS_MORE_FEED,
	DELETE_FEED_ID_LIST_BY_ID,
	SET_FEED_ID_LIST,
	ADD_FEED_ID_LIST_BY_ID,
	SET_TOTAL_FEED,
	SET_FEED_DELETED_STATUS,
} from "./Types";

export const setFeeds = (payload) => {
	return {
		type: SET_FEEDS,
		payload: payload,
	};
};

export const addFeed = (payload) => {
	return {
		type: ADD_FEED,
		payload: payload,
	};
};
export const addFeedIdListById = (payload) => {
	return {
		type: ADD_FEED_ID_LIST_BY_ID,
		payload: payload,
	};
};
export const setCommentStatus = (payload) => {
	return {
		type: SET_COMMENT_STATUS,
		payload: payload,
	};
};
export const setCommentCount = (payload) => {
	return {
		type: SET_COMMENT_COUNT,
		payload: payload,
	};
};

export const deleteFeedsByCommunityId = (payload) => {
	return {
		type: DELETE_FEEDS_BY_COMMUNITY_ID,
		payload: payload,
	};
};

export const deleteAllFeeds = (payload) => {
	return {
		type: DELETE_ALL_POST,
		payload: payload,
	};
};
export const deleteFeedById = (payload) => {
	return {
		type: DELETE_FEED_BY_ID,
		payload: payload,
	};
};

export const deleteFeedByAdmin = (payload) => {
	return {
		type: DELETE_FEED_BY_ADMIN,
		payload: payload,
	};
};

export const restoreFeedByAdmin = (payload) => {
	return {
		type: RESTORE_FEED_BY_ADMIN,
		payload: payload,
	};
};

export const setFeedMode = (payload) => {
	return {
		type: SET_FEED_MODE,
		payload: payload,
	};
};

export const setFeedUsers = (payload) => {
	return {
		type: SET_FEED_USERS,
		payload: payload,
	};
};

export const setFeed = (payload) => {
	return {
		type: SET_FEED,
		payload: payload,
	};
};

export const setFeedsName = (payload) => {
	return {
		type: SET_FEEDS_NAME,
		payload: payload,
	};
};

export const removeLastFeed = () => {
	return {
		type: REMOVE_LAST_FEED,
	};
};

export const hasMoreFeed = (payload) => {
	return {
		type: HAS_MORE_FEED,
		payload: payload,
	};
};

export const deleteFeedIdListById = (payload) => {
	return {
		type: DELETE_FEED_ID_LIST_BY_ID,
		payload: payload,
	};
};

export const setFeedIdList = (payload) => {
	return {
		type: SET_FEED_ID_LIST,
		payload: payload,
	};
};

export const setTotalFeed = (payload) => {
	return {
		type: SET_TOTAL_FEED,
		payload: payload,
	};
};

export const setFeedDeletedStatus = (payload) => {
	return {
		type: SET_FEED_DELETED_STATUS,
		payload: payload,
	};
};
