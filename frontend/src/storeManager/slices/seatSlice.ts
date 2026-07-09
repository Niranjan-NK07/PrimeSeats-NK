import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { seatService } from "../../services/seatService";

export interface Seat {
  eventId: string;
  section: string;
  row: string;
  number: string;
  status: "available" | "locked" | "booked";
  lockedUntil?: Date;
}

interface seatState {
  seats: Seat[];
  mySeats: Seat[];
  loading: boolean;
  error: string | null;
}

const initialState: seatState = {
  seats: [],
  mySeats: [],
  loading: false,
  error: null,
};

export const getSeats = createAsyncThunk<
  Seat[],
  string,
  { rejectValue: string }
>("seats/getSeats", async (eventID, thunkAPI) => {
  try {
    const res = await seatService.getSeats(eventID);
    return res;
  } catch (err) {
    return thunkAPI.rejectWithValue(
      err instanceof Error ? err.message : "Something wrong !",
    );
  }
});
export const getMySeats = createAsyncThunk<
  Seat[],
  void,
  { rejectValue: string }
>("seats/mySeats", async (_, thunkAPI) => {
  try {
    const res = await seatService.getMySeats();
    return res;
  } catch (err) {
    return thunkAPI.rejectWithValue(
      err instanceof Error ? err.message : "Something wrong !",
    );
  }
});

const seatSlice = createSlice({
  name: "seats",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(getSeats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSeats.fulfilled, (state, action) => {
        state.loading = false;
        state.seats = action.payload;
        state.error = null;
      })
      .addCase(getSeats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to fetch seats !";
      })
      .addCase(getMySeats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMySeats.fulfilled, (state, action) => {
        state.loading = false;
        state.mySeats = action.payload;
        state.error = null;
      })
      .addCase(getMySeats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to fetch seats !";
      });
  },
});

export default seatSlice.reducer;
