import {
  SET_FAVORITE_COMMUNITY,
  ADD_FAVORITE_COMMUNITY,
  REMOVE_FAVORITE_COMMUNITY,
  CHANGE_STATE_FAVORITE_COMMUNITY
} from "./Types";
const initialState = {
  data: [],
};

const favoriteReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_FAVORITE_COMMUNITY:
      return {
        ...state,
        data: action.payload,
      };
    case ADD_FAVORITE_COMMUNITY:
      return {
        ...state,
        data: [action.payload, ...state.data],
      };
    case REMOVE_FAVORITE_COMMUNITY:
      return {
        ...state,
        data: [...state.data].filter(
          (item) => item.communityId !== action.payload
        ),
      };
      case CHANGE_STATE_FAVORITE_COMMUNITY:
      console.log("CHANGE_STATE_FAVORITE_COMMUNITY",action.payload);
      console.log([...state.data]);
      console.log(action.payload);
      let cloneState1 = [...state.data];
      let obj1 = cloneState1.find((item) => item.communityId === action.payload.communityId);
      let objIndex1 = cloneState1.indexOf(obj1);
      console.log(objIndex1);
      cloneState1[objIndex1].state = action.payload.state;
      console.log(cloneState1)

      return {
        ...state,
        data: cloneState1,
      };
    default:
      return state;
  }
};

export default favoriteReducer;
