import { createSlice } from "@reduxjs/toolkit";

let lastTaskid = 0;

const slice = createSlice({
  name: "dashboard",
  initialState: {
    tasks: [],
  },
  reducers: {
    // nodeAdded: (state, action) => {
    //   state.nodes.push({
    //     id: ++lastNodeId,
    //     node: action.payload.node,
    //   });
    //   console.log(action);
    //   console.log(state, action.payload);
    // },
    //   console.log(action);
    //   console.log(state, action.payload);
  },
});
export const { taskAdded } = slice.actions;
export default slice.reducer;
