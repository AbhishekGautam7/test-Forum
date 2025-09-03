import { SET_PUBLIC_COMMUNITY, REMOVE_PUBLIC_COMMUNITY } from "./Types";
const initialState = {
  data: [],
};


const publicCommunityReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_PUBLIC_COMMUNITY:
      return {
        ...state,
        data: action.payload,
      };
    case REMOVE_PUBLIC_COMMUNITY:
      return {
        ...state,
        data: state.data.filter((item) => item._id !== action.payload),
      };
    default:
      return state;
  }
};

export default publicCommunityReducer;
