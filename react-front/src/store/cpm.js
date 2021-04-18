import { createSlice } from "@reduxjs/toolkit";
import { getTasks } from "../project/apiProject";

let lastNodeId = 0;
let lastConnectionId = 0;

const slice = createSlice({
  name: "cpm",
  initialState: {
    nodes: [],
    connections: [],
    elements: [],
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
    replaceNodes: (state, action) => {
      const nodes = action.payload.nodes;
      void (state.nodes = nodes);
    },
    replaceConnections: (state, action) => {
      const connections = action.payload.connections;
      void (state.connections = connections);
    },
    replaceElements: (state, action) => {
      const elements = action.payload.elements;
      void (state.elements = elements);
    },
  },
});
export const {
  nodeAdded,
  connectionAdded,
  replaceNodes,
  replaceConnections,
  replaceElements,
} = slice.actions;
export default slice.reducer;
