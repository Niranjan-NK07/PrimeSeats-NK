import { configureStore } from "@reduxjs/toolkit";
import eventReducer from "./slices/eventSlice";
import seatReducer from "./slices/seatSlice";
import authReducer from "./slices/authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    events: eventReducer,
    seats: seatReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
