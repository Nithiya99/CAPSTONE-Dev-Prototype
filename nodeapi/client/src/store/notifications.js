import { createSlice } from "@reduxjs/toolkit";
import { addNotification, getNotifications } from "./../apiNotifications";
import { toast } from "react-toastify";
import { isAuthenticated } from "../auth";
const slice = createSlice({
  name: "notifications",
  initialState: {
    notifications: [],
    segregatedNotifications: {},
  },
  reducers: {
    notificationAdded: (state, action) => {
      addNotification(
        action.payload.userId,
        action.payload.message,
        action.payload.type,
        action.payload.projectId
      )
        .then((response) => {
          return response.json();
        })
        .then((user) => {
          let notifications = user.user.notifications;
          if (action.payload.userId === isAuthenticated().user._id) {
            toast.dark(action.payload.message, {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
          }
          console.log(notifications);
        });
    },
    getNotified: (state, action) => {
      state.notifications.push({
        id: action.payload.id,
        message: action.payload.message,
        read: action.payload.read,
        type: action.payload.type,
        projectId: action,
      });
    },
    clearNotifications: (state, action) => {
      state.notifications = [];
    },
    setSegregatedNotifications: (state, action) => {
      const segregatedNotificationsObj = action.payload.segregatedNotifications;
      void (state.segregatedNotifications = segregatedNotificationsObj);
    },
  },
});
export const {
  notificationAdded,
  getNotified,
  clearNotifications,
  setSegregatedNotifications,
} = slice.actions;
export default slice.reducer;
