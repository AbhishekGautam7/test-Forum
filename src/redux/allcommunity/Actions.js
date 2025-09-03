import {
	SET_ALL_COMMUNITY,
	ADD_ALL_COMMUNITY,
	DELETE_FROM_ALL_COMMUNITY,
	CHANGE_STATE_ALL_COMMUNITY,
	SET_ALL_COMMUNITY_STATUS,
} from "./Types";

export const setAllCommunity = (payload) => {
	return {
		type: SET_ALL_COMMUNITY,
		payload: payload,
	};
};

export const addAllCommunity = (payload) => {
	return {
		type: ADD_ALL_COMMUNITY,
		payload: payload,
	};
};

export const deleteFromAllCommunity = (payload) => {
	return {
		type: DELETE_FROM_ALL_COMMUNITY,
		payload: payload,
	};
};

export const changeStateAllCommunity = (payload) => {
	return {
		type: CHANGE_STATE_ALL_COMMUNITY,
		payload: payload,
	};
};

export const setAllCommunityStatus = (payload) => {
	return {
		type: SET_ALL_COMMUNITY_STATUS,
		payload: payload,
	};
};
