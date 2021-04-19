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
    pert: {},
  },
  reducers: {
    nodeAdded: (state, action) => {
      state.nodes.push(action.payload.node);
      //   console.log(action);
      //   console.log(state, action.payload);
    },
    connectionAdded: (state, action) => {
      // console.log(action.payload);
      state.connections.push(action.payload.connection);
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
    setPert: (state, action) => {
      const pert = action.payload.pert;
      void (state.pert = pert);
    },
  },
});
export const {
  nodeAdded,
  connectionAdded,
  replaceNodes,
  replaceConnections,
  replaceElements,
  setPert,
} = slice.actions;
export default slice.reducer;
