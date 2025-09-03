import { SET_CONFIRM_MESSAGE_BOX, SET_CONFIRM_MESSAGE_TXT,SET_CONFIRM_MESSAGE_FEED_ID,SET_CONFIRM_MESSAGE_FEED_ACTION  } from "./Types";
const initialState = {
  status: false,
  message: "Sample Message Box Text ...",
  feedId:null,
  action:""
};

const confirmMessageBoxReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CONFIRM_MESSAGE_BOX:
      return {
        ...state,
        status: action.payload,
      };
    case SET_CONFIRM_MESSAGE_TXT:
      return {
        ...state,
        message: action.payload,
      };
    case SET_CONFIRM_MESSAGE_FEED_ID:
      return {
        ...state,
        feedId: action.payload,
      };
      case SET_CONFIRM_MESSAGE_FEED_ACTION:
        return {
          ...state,
          action: action.payload,
        };
      
    default:
      return state;
  }
};

export default confirmMessageBoxReducer;
