import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BlogState } from "../types";

const initialState: BlogState = {
  userOfInterest: "",
  isHome: true,
};

const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {
    setUserOfInterest: (state, action: PayloadAction<string>) => {
      state.userOfInterest = action.payload;
    },
    setIsHome: (state, action: PayloadAction<boolean>) => {
      state.isHome = action.payload;
    },
  },
});

export const { setUserOfInterest, setIsHome } = blogSlice.actions;
export default blogSlice.reducer;
