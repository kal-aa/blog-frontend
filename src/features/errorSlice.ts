import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ErrorState } from "../types";

const initialState: ErrorState = { message: null };

const errorSlice = createSlice({
  name: "error",
  initialState,
  reducers: {
    setGlobalError: (state, action: PayloadAction<string>) => {
      state.message = action.payload;
    },
    clearGlobalError: (state) => {
      state.message = null;
    },
  },
});

export const { setGlobalError, clearGlobalError } = errorSlice.actions;
export default errorSlice.reducer;
