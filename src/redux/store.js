import { applyMiddleware, legacy_createStore as createStore } from "redux";
import { composeWithDevTools } from "@redux-devtools/extension";
import rootReducer from "./combineReducer";
import socketMiddleware from "./middleware/socketMiddleware";

const middleware = [socketMiddleware()];

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
