import { SET_MESSAGE_BOX, SET_MESSAGE_TXT,SET_CLOSE_BTN } from "./Types";
const initialState = {
  status: false,
  message: "Sample Message Box Text ...",
  closeBtnStatus : true
};

const messageBoxReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_MESSAGE_BOX:
     
      return {
        ...state,
        status: action.payload,
      };
    case SET_MESSAGE_TXT:
      return {
        ...state,
        message: action.payload,
      };
      case SET_CLOSE_BTN:
      console.log("closing",action.payload);
      return {
        ...state,
        closeBtnStatus: action.payload,
      };
    default:
      return state;
  }
};

export default messageBoxReducer;
