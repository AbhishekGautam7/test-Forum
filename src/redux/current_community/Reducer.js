import {
    SET_CURRENT_COMMUNITY,
    CHANGE_CURRENT_COMMUNITY_STATE,
    SET_COMMUNITY_USERS,
    ADD_COMMUNITY_USERS,
    CHANGE_COMMUNITY_DESCRIPTION
} from "./Types";
const initialState = {
    data: {},
};

const currentCommunityReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_CURRENT_COMMUNITY:
            return {
                ...state,
                data: action.payload,
            };
        case CHANGE_CURRENT_COMMUNITY_STATE:
            let cloneState = { ...state.data };
            cloneState.state = action.payload;
            return {
                ...state,
                data: cloneState,
            };
        case CHANGE_COMMUNITY_DESCRIPTION:
            let cloneState3 = { ...state.data };
            cloneState3.description = action.payload;
            return {
                ...state,
                data: cloneState3,
            };

        case SET_COMMUNITY_USERS:
            let cloneState1 = { ...state.data };
            cloneState1.communityUsers = action.payload;
            return {
                ...state,
                data: cloneState1,
            };
        case ADD_COMMUNITY_USERS:
            let cloneState2 = { ...state.data };
            cloneState2.communityUsers = [action.payload, ...state.data.communityUsers]
            return {
                ...state,
                data: cloneState2,
            };
        default:
            return state;
    }
};

export default currentCommunityReducer;