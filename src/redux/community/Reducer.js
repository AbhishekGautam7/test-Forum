import {
  CREATE_COMMUNITY,
  CHANGE_COMMUNITY_NAME,
  CHANGE_COMMUNITY_DESCRIPTION,
  TOGGLE_PRIVATE_STATUS,
  CHANGE_START_DATE,
  CHANGE_END_DATE,
  SET_PRIVATE_STATUS
} from "./Types";
const initialState = {
  name: "",
  description: "",
  members: [],
  isPrivate: false,
  startDate:null,
  endDate:null,
  
};

const communityReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_COMMUNITY:
      return {
        ...state,
        name: "Sample Community Name",
      };
    case CHANGE_COMMUNITY_NAME:
      return {
        ...state,
        name: action.payload,
      };
    case CHANGE_COMMUNITY_DESCRIPTION:
      return {
        ...state,
        description: action.payload,
      };
      case TOGGLE_PRIVATE_STATUS:
        return {
          ...state,
          isPrivate: !state.isPrivate,
        };
    case SET_PRIVATE_STATUS:
      return {
        ...state,
        isPrivate: action.payload,
      };
      case CHANGE_START_DATE:
      return {
        ...state,
        startDate: action.payload,
      };
      case CHANGE_END_DATE:
      return {
        ...state,
        endDate: action.payload,
      };
    default:
      return state;
  }
};

export default communityReducer;
