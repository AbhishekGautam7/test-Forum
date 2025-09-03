import { SET_SEARCH_BOX_STATUS, SET_SEARCH_TXT } from "./Types";

const initialState = {
  status: false,
  keyword: "",
};

const searchBoxReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SEARCH_BOX_STATUS:
      return {
        ...state,
        status: action.payload,
      };
    case SET_SEARCH_TXT:
      return {
        ...state,
        keyword: action.payload,
      };
    default:
      return state;
  }
};

export default searchBoxReducer;
