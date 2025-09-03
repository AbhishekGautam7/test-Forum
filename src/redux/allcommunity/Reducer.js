import {
	ADD_ALL_COMMUNITY,
	CHANGE_STATE_ALL_COMMUNITY,
	DELETE_FROM_ALL_COMMUNITY,
	SET_ALL_COMMUNITY,
	SET_ALL_COMMUNITY_STATUS,
} from "./Types";
const initialState = {
	data: [],
	status: true,
};

const allCommunityReducer = (state = initialState, action) => {
	switch (action.type) {
		case SET_ALL_COMMUNITY_STATUS:
			return {
				...state,
				status: action.payload,
			};
		case SET_ALL_COMMUNITY:
			return {
				...state,
				data: action.payload,
			};
		case ADD_ALL_COMMUNITY:
			console.log("addCommunity", state);
			console.log("action", action);
			return {
				...state,
				data: [action.payload, ...state.data],
			};
		case DELETE_FROM_ALL_COMMUNITY:
			return {
				...state,
				data: [...state.data].filter((item) => item._id !== action.payload),
			};

		case CHANGE_STATE_ALL_COMMUNITY:
			let cloneState1 = [...state.data];

			let obj1 = cloneState1.find(
				(item) => item._id === action.payload.communityId
			);

			let objIndex1 = cloneState1.indexOf(obj1);

			cloneState1[objIndex1].state = action.payload.state;
			return {
				...state,
				data: cloneState1,
			};
		default:
			return state;
	}
};

export default allCommunityReducer;
