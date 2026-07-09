import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authService } from "../../services/authService";

interface AuthState {
  isAuthenticated: boolean;
  user: any | null;
  loading: boolean;
  error: string | null;
  users: any[] | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
  users: null,
};

export const login = createAsyncThunk<
  any,
  { username: string; password: string },
  { rejectValue: string }
>("auth/login", async ({ username, password }, thunkAPI) => {
  try {
    return await authService.login(username, password);
  } catch (err) {
    return thunkAPI.rejectWithValue(
      err instanceof Error ? err.message : "Something went wrong!",
    );
  }
});

export const register = createAsyncThunk<
  any,
  { username: string; email: string; password: string },
  { rejectValue: string }
>("auth/register", async ({ username, email, password }, thunkAPI) => {
  try {
    return await authService.register({ username, email, password });
  } catch (err) {
    return thunkAPI.rejectWithValue(
      err instanceof Error ? err.message : "Something went wrong!",
    );
  }
});

export const getUser = createAsyncThunk<any, string, { rejectValue: string }>(
  "auth/getUser",
  async (userId, thunkAPI) => {
    try {
      return await authService.getUser(userId);
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err instanceof Error ? err.message : "Something went wrong!",
      );
    }
  },
);

export const getUsers = createAsyncThunk<any, void, { rejectValue: string }>(
  "auth/getUsers",
  async (_, thunkAPI) => {
    try {
      return await authService.getUsers();
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err instanceof Error ? err.message : "Something went wrong!",
      );
    }
  },
);

export const promoteOrDemote = createAsyncThunk<
  any,
  { userId: string; role: string },
  { rejectValue: string }
>("auth/promoteOrDemote", async ({ userId, role }, thunkAPI) => {
  try {
    return await authService.promoteOrDemote(userId, role);
  } catch (err) {
    return thunkAPI.rejectWithValue(
      err instanceof Error ? err.message : "Something went wrong!",
    );
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(promoteOrDemote.pending, (state) => {
        state.loading = true;
      })
      .addCase(promoteOrDemote.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(promoteOrDemote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
