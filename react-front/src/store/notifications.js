import { createSlice } from "@reduxjs/toolkit";
import { addNotification, getNotifications } from "./../apiNotifications";

const slice = createSlice({
  name: "notifications",
  initialState: {
    notifications: [],
  },
  reducers: {
    notificationAdded: (state, action) => {
      addNotification(
        action.payload.userId,
        action.payload.message,
        action.payload.type
      )
        .then((response) => {
          return response.json();
        })
        .then((user) => {
          let notifications = user.user.notifications;
          console.log(notifications);
        });
    },
    getNotified: (state, action) => {
      state.notifications.push({
        id: action.payload.id,
        message: action.payload.message,
        read: action.payload.read,
        type: action.payload.type,
      });
    },
    clearNotifications: (state, action) => {
      state.notifications = [];
    },
  },
});
export const {
  notificationAdded,
  getNotified,
  clearNotifications,
} = slice.actions;
export default slice.reducer;
