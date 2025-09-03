import { SET_CONFIRM_MESSAGE_BOX, SET_CONFIRM_MESSAGE_TXT,SET_CONFIRM_MESSAGE_FEED_ID,SET_CONFIRM_MESSAGE_FEED_ACTION } from "./Types";

export const setConfirmMessageBox = (payload) => {
  return {
    type: SET_CONFIRM_MESSAGE_BOX,
    payload: payload,
  };
};
export const setConfirmMessageTxt = (payload) => {
  return {
    type: SET_CONFIRM_MESSAGE_TXT,
    payload: payload,
  };
};
export const setConfirmMessagBoxFeedId = (payload) => {
  return {
    type: SET_CONFIRM_MESSAGE_FEED_ID,
    payload: payload,
  };
};
export const setConfirmMessagBoxFeedAction = (payload) => {
  return {
    type: SET_CONFIRM_MESSAGE_FEED_ACTION,
    payload: payload,
  };
};


