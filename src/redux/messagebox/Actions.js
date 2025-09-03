import { SET_MESSAGE_BOX, SET_MESSAGE_TXT, SET_CLOSE_BTN } from "./Types";

export const setMessageBox = (payload) => {
  return {
    type: SET_MESSAGE_BOX,
    payload: payload,
  };
};
export const setMessageTxt = (payload) => {
  return {
    type: SET_MESSAGE_TXT,
    payload: payload,
  };
};

export const setMessageBoxCloseBtn = (payload) => {
  return {
    type: SET_CLOSE_BTN,
    payload: payload,
  };
};
