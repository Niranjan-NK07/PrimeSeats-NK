import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { eventService } from "../../services/eventServices";

export interface Event {
  _id?: string;
  title: string;
  description: string;
  venue: string;
  dateTime: Date;
  organizerId: string;
  category: string;
  status: "upcoming" | "cancelled" | "completed";
  totalSeats: number;
}

interface eventState {
  events: Event[];
  categories: { label: string; value: string }[];
  currentEvent: any | null;
  loading: boolean;
  error: string | null;
  searchLoading: boolean;
  searchError: string | null;
}

const initialState: eventState = {
  events: [],
  categories: [],
  currentEvent: null,
  loading: false,
  error: null,
  searchLoading: false,
  searchError: null,
};

export const getEvents = createAsyncThunk<
  Event[],
  void,
  { rejectValue: string }
>("events/getEvents", async (_, thunkAPI) => {
  try {
    const response = await eventService.getEvents();
    return response;
  } catch (err) {
    return thunkAPI.rejectWithValue(
      err instanceof Error ? err.message : "Something wrong !",
    );
  }
});

export const getEvent = createAsyncThunk<
  Event,
  string,
  { rejectValue: string }
>("events/getEvent", async (eventId, thunkAPI) => {
  try {
    const response = await eventService.getEvent(eventId);
    return response;
  } catch (err) {
    return thunkAPI.rejectWithValue(
      err instanceof Error ? err.message : "Something wrong !",
    );
  }
});

export const searchEvents = createAsyncThunk<
  Event[],
  { searchValue: string; category: string; location: string },
  { rejectValue: string }
>(
  "events/searchEvents",
  async ({ searchValue, category, location }, thunkAPI) => {
    try {
      const response = await eventService.searchEvents({
        searchValue,
        category,
        location,
      });
      return response;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err instanceof Error ? err.message : "Something wrong !",
      );
    }
  },
);

const eventSlice = createSlice({
  name: "event",
  initialState: initialState,
  reducers: {},

  extraReducers(builder) {
    builder
      .addCase(getEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload;
        state.error = null;

        const uniqueCategories = Array.from(
          new Set(action.payload.map((event) => event.category)),
        ).map((category) => ({
          label: category.charAt(0).toUpperCase() + category.slice(1),
          value: category,
        }));
        state.categories = uniqueCategories;
      })
      .addCase(getEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to fetch seats !";
      })
      .addCase(searchEvents.pending, (state) => {
        state.searchLoading = true;
        state.searchError = null;
      })
      .addCase(searchEvents.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.events = action.payload;
        state.searchError = null;

        const searchUniqueCategories = Array.from(
          new Set(action.payload.map((event) => event.category)),
        ).map((category) => ({
          label: category.charAt(0).toUpperCase() + category.slice(1),
          value: category,
        }));
        state.categories = searchUniqueCategories;
      })
      .addCase(searchEvents.rejected, (state, action) => {
        state.searchLoading = false;
        state.searchError = action.payload ?? "Failed to search events !";
      })
      .addCase(getEvent.fulfilled, (state, action) => {
        state.currentEvent = action.payload;
      })
      .addCase(getEvent.rejected, (state, action) => {
        state.error = action.payload ?? "Failed to fetch event!";
      });
  },
});

export default eventSlice.reducer;
