import {
  SET_TODAYS_COMMUNITY,
  ADD_TODAYS_COMMUNITY,
  REMOVE_FROM_TODAYS_COMMUNITY,
  CHANGE_STATE_TODAYS_COMMUNITY
} from "./Types";
const initialState = {
  data: [],
};

const todayCommunityReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_TODAYS_COMMUNITY:
      console.log("SET_TODAYS_COMMUNITY");
      return {
        ...state,
        data: action.payload,
      };
    case ADD_TODAYS_COMMUNITY:
      return {
        ...state,
        data: [action.payload, ...state.data],
      };

    case REMOVE_FROM_TODAYS_COMMUNITY:
      console.log("REMOVE_FROM_TODAYS_COMMUNITY");
      return {
        ...state,
        data: [...state.data].filter((item) => item._id !== action.payload),
      };

      case CHANGE_STATE_TODAYS_COMMUNITY:
     
      let cloneState1 = [...state.data];
      console.log(cloneState1);
     console.log(action.payload); 
      let obj1 = cloneState1.find((item) => item._id === action.payload.communityId);
     
      let objIndex1 = cloneState1.indexOf(obj1);
      console.log(obj1);
      console.log(action.payload.state);
   
      cloneState1[objIndex1].state = action.payload.state;
      return {
        ...state,
        data: cloneState1,
      };
    default:
      return state;
  }
};

export default todayCommunityReducer;
