import { createSlice } from "@reduxjs/toolkit";

const errorSlice = createSlice({
  name: "error",
  initialState: { message: null },
  reducers: {
    setGlobalError: (state, action) => {
      state.message = action.payload;
    },
    clearGlobalError: (state) => {
      state.message = null;
    },
  },
});

export const { setGlobalError, clearGlobalError } = errorSlice.actions;
export default errorSlice.reducer;
