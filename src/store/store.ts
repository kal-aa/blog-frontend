import { configureStore } from "@reduxjs/toolkit";
import blogReducer from "../features/blogSlice";
import errorReducer from "../features/errorSlice";

export const store = configureStore({
  reducer: {
    blog: blogReducer,
    globalError: errorReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;