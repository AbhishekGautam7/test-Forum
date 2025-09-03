import { SET_MY_PROFILE } from "./Types";
const initialState = {
  data: [],
};

const myProfileReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_MY_PROFILE:
      return {
        ...state,
        data: action.payload,
      };

    default:
      return state;
  }
};

export default myProfileReducer;
