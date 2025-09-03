import {
  SET_SEARCH_KEYWORD,
  SET_SEARCH_COMMUNITY_LIST,
  SET_SEARCH_MEMBER_LIST,
  SET_SEARCH_ATTACHMENT_LIST,
  SET_SEARCH_TAB,
  SET_LOAD_SEARCH_RESULT,
  SET_SEARCH_TYPE,
  SET_SEARCH_TOPICS,
  SET_SEARCH_TO,
  SET_SEARCH_FROM,
  SET_COMMUNITY_ID
} from "./Types";
const initialState = {
  keyword: "",
  communityList: [],
  memberList: [],
  attachmentList: [],
  tab:"",
  searchResult:false,
  type:"",
  topics:[],
  to:"",
  from:"",
  communityId:""
};

const searchReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SEARCH_KEYWORD:
      return {
        ...state,
        keyword: action.payload,
      };
    case SET_SEARCH_COMMUNITY_LIST:
      console.log("SET_SEARCH_COMMUNITY_LIST",action.payload);
      return {
        ...state,
        communityList: action.payload,
      };
    case SET_SEARCH_MEMBER_LIST:
      return {
        ...state,
        memberList: action.payload,
      };
    case SET_SEARCH_ATTACHMENT_LIST:
      return {
        ...state,
        attachmentList: action.payload,
      };
      case SET_SEARCH_TAB:
      return {
        ...state,
        tab: action.payload,
      };
      case SET_LOAD_SEARCH_RESULT:
        return {
          ...state,
          searchResult: action.payload,
        };
        case SET_SEARCH_TYPE:
          return {
            ...state,
            type: action.payload,
          };
        case SET_SEARCH_TOPICS:
          return {
            ...state,
            topics: action.payload,
          };
        case SET_SEARCH_TO:
        return {
          ...state,
          to: action.payload,
        };
        case SET_SEARCH_FROM:
        return {
          ...state,
          from: action.payload,
        };
        case SET_COMMUNITY_ID:
        return {
          ...state,
          communityId: action.payload,
        };
        
    default:
      return state;
  }
};

export default searchReducer;