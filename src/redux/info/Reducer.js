import {
  SET_LOADING,
  SET_BOX,
  SET_CREATE_COMMUNITY_STATUS,
  SET_EDIT_COMMUNITY_STATUS,
  SET_MODAL,
  SET_POST,
  SET_PAGE,
  SET_USER_ID,
  SET_ORG_ID,
  SET_COMMUNITY_ID,
  SET_CLIENT_ID,
  SET_TENENT_ID,
  SET_SECRET_KEY,
  SET_APP_ID,
  SET_INVITE_USERS_STATUS,
  SET_COMMUNITY_HEADER_TAB,
  SET_TAG,
  SET_CURRENT_FEED_ID,
  SET_TOKEN
  
} from "./Types";
const initialState = {
  isLoading: false,
  box: "discussion",
  page: "home",
  isCreateCommunity: false,
  isEditCommunity: false,
  isModal: false,
  post: "welcome",
  userId: "",
  orgId: "",
  communityId: null,
  clientId: "",
  tenentId: "",
  secretKey: "",
  appId: "",
  myconnectUserId: "",
  inviteUsersStatus: false,
  communityHeaderTab: "conversations",
  tag:"",
  currentFeedId:null,
  token:"",
 
};

const infoReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };
    case SET_BOX:
      return {
        ...state,
        box: action.payload,
      };
    case SET_CREATE_COMMUNITY_STATUS:
      return {
        ...state,
        isCreateCommunity: action.payload,
      };
    case SET_EDIT_COMMUNITY_STATUS:
      return {
        ...state,
        isEditCommunity: action.payload,
      };

    case SET_MODAL:
      return {
        ...state,
        isModal: action.payload,
      };
    case SET_POST:
      return {
        ...state,
        post: action.payload,
      };
    case SET_PAGE:
      return {
        ...state,
        page: action.payload,
      };

    case SET_USER_ID:
      return {
        ...state,
        userId: action.payload,
      };
      case SET_TOKEN:
      return {
        ...state,
        token: action.payload,
      };
    case SET_ORG_ID:
      return {
        ...state,
        orgId: action.payload,
      };
    case SET_COMMUNITY_ID:
      return {
        ...state,
        communityId: action.payload,
      };
    case SET_CLIENT_ID:
      return {
        ...state,
        clientId: action.payload,
      };
    case SET_TENENT_ID:
      return {
        ...state,
        tenentId: action.payload,
      };
    case SET_SECRET_KEY:
      return {
        ...state,
        secretKey: action.payload,
      };
    case SET_APP_ID:
      return {
        ...state,
        appId: action.payload,
      };
    case SET_INVITE_USERS_STATUS:
      return {
        ...state,
        inviteUsersStatus: action.payload,
      };
    case SET_COMMUNITY_HEADER_TAB:
      return {
        ...state,
        communityHeaderTab: action.payload,
      };
    case SET_TAG:
      return {
        ...state,
        tag: action.payload,
      };
       case SET_CURRENT_FEED_ID:
      return {
        ...state,
        currentFeedId: action.payload,
      };
   

    default:
      return state;
  }
};

export default infoReducer;
