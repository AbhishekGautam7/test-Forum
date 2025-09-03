import {
	ADD_MY_COMMUNITY,
	CHANGE_STATE_MY_COMMUNITY,
	DELETE_MY_COMMUNITY,
	SET_MY_COMMUNITY,
} from "./Types";
const initialState = {
	data: [],
};

const myCommunityReducer = (state = initialState, action) => {
	switch (action.type) {
		case SET_MY_COMMUNITY:
			return {
				...state,
				data: action.payload,
			};
		case ADD_MY_COMMUNITY:
			return {
				...state,
				data: [action.payload, ...state.data],
			};
		case DELETE_MY_COMMUNITY:
			return {
				...state,
				data: [...state.data].filter((item) => item._id !== action.payload),
			};
		case CHANGE_STATE_MY_COMMUNITY:
			console.log("CHANGE_STATE_MY_COMMUNITY");
			console.log(action.payload);
			let cloneState1 = [...state.data];
			console.log(cloneState1);
			let obj1 = cloneState1.find(
				(item) => item._id === action.payload.communityId
			);
			console.log(obj1);
			let objIndex1 = cloneState1.indexOf(obj1);
			console.log(objIndex1);
			console.log(cloneState1[objIndex1]);
			cloneState1[objIndex1].state = action.payload.state;

			return {
				...state,
				data: cloneState1,
			};
		default:
			return state;
	}
};

export default myCommunityReducer;
