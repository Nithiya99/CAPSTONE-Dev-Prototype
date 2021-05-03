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
      const user = action.payload.user;
      let obj = {};
      let canAdd = true;
      Object.keys(state).map((key) => {
        state[key].map((val) => {
          let userObj = { ...val };
          if (userObj._id === user._id) {
            canAdd = false;
          }
        });
      });
      if (canAdd) state.friends.push(user);
    },
    clearFriends : (state, action) =>{
      void (state.friends = []);
    }
  },
});
export const { updateFollowing, friendAdded, clearFriends } = slice.actions;
export default slice.reducer;
