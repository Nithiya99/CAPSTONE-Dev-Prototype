import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "user",
  initialState: {
    following: [],
  },
  reducers: {
    updateFollowing: (state, action) => {
      const tasks = action.payload.following;
      void (state.following = tasks);
    },
  },
});
export const { updateFollowing } = slice.actions;
export default slice.reducer;
