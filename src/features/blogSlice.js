import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userOfInterest: "",
  isHome: true,
};

const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {
    setUserOfInterest: (state, action) => {
      state.userOfInterest = action.payload;
    },
    setIsHome: (state, action) => {
      state.isHome = action.payload;
    },
  },
});

export const { setUserOfInterest, setIsHome } = blogSlice.actions;
export default blogSlice.reducer;
