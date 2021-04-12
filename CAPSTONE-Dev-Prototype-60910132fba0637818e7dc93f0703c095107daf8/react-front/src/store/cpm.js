import { createSlice } from "@reduxjs/toolkit";

let lastNodeId = 0;
let lastConnectionId = 0;

const slice = createSlice({
  name: "cpm",
  initialState: {
    nodes: [],
    connections: [],
  },
  reducers: {
    nodeAdded: (state, action) => {
      state.nodes.push({
        id: ++lastNodeId,
        node: action.payload.node,
      });
      //   console.log(action);
      //   console.log(state, action.payload);
    },
    connectionAdded: (state, action) => {
      // console.log(action.payload);
      state.connections.push({
        id: ++lastConnectionId,
        connection: action.payload.connection,
      });
      //   console.log(action);
      //   console.log(state, action.payload);
    },
  },
});
export const { nodeAdded, connectionAdded } = slice.actions;
export default slice.reducer;
