import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "tasks",
  initialState: {
    tasks: [],
  },
  reducers: {
    updateTasks: (state, action) => {
      const tasks = action.payload.tasks;
      void (state.tasks = tasks);
    },
  },
});
export const { updateTasks } = slice.actions;
export default slice.reducer;
