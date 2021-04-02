import cpmReducer from "./cpm";
import projectDashBoardReducer from "./dashboard";
import { combineReducers } from "redux";

export default combineReducers({
  cpm: cpmReducer,
  taskDashboard: projectDashBoardReducer,
});
