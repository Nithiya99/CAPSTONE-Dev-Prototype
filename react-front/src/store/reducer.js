import cpmReducer from "./cpm";
import notificationReducer from "./notifications";
import tasksReducer from "./tasks";
import userReducer from "./user";
import { combineReducers } from "redux";

export default combineReducers({
  cpm: cpmReducer,
  notifications: notificationReducer,
  tasks: tasksReducer,
  user: userReducer,
});
