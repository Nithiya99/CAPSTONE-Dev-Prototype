import cpmReducer from "./cpm";
import notificationReducer from "./notifications";
import tasksReducer from "./tasks";
import { combineReducers } from "redux";

export default combineReducers({
  cpm: cpmReducer,
  notifications: notificationReducer,
  tasks: tasksReducer,
});
