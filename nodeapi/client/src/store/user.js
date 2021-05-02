import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "user",
  initialState: {
    following: [],
    friends: [],
  },
  reducers: {
    updateFollowing: (state, action) => {
      const tasks = action.payload.following;
      void (state.following = tasks);
    },
    friendAdded: (state, action) => {
      state.friends.push(action.payload.user);
    },
  },
});
export const { updateFollowing, friendAdded } = slice.actions;
export default slice.reducer;
