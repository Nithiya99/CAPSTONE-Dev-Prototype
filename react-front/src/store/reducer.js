import cpmReducer from "./cpm";
import notificationReducer from "./notifications";
import projectDashBoardReducer from "./dashboard";
import { combineReducers } from "redux";

export default combineReducers({
  cpm: cpmReducer,
  notifications: notificationReducer,
});
