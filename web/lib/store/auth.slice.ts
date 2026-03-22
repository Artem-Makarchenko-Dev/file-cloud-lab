import { createSlice } from '@reduxjs/toolkit';
import {
  bootstrapAuthThunk,
  loginThunk,
  logoutThunk,
  meThunk,
  refreshThunk,
} from './auth.thunks';
import type { AuthUser } from './auth.types';

export type { AuthUser };

type AuthState = {
  accessToken: string | null;
  user: AuthUser | null;
  status: 'idle' | 'loading' | 'error';
  error: unknown;
  isAuthReady: boolean;
};

const initialState: AuthState = {
  accessToken: null,
  user: null,
  status: 'idle',
  error: null,
  isAuthReady: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAccessToken(state, action: { payload: string | null }) {
      state.accessToken = action.payload;
    },
    clearAuth(state) {
      state.accessToken = null;
      state.user = null;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (s) => {
        s.status = 'loading';
        s.error = null;
      })
      .addCase(loginThunk.fulfilled, (s, a) => {
        s.status = 'idle';
        s.accessToken = a.payload.accessToken;
      })
      .addCase(loginThunk.rejected, (s, a) => {
        s.status = 'error';
        s.error = a.payload ?? a.error;
      })

      .addCase(refreshThunk.fulfilled, (s, a) => {
        s.accessToken = a.payload.accessToken;
      })
      .addCase(refreshThunk.rejected, (s) => {
        s.accessToken = null;
        s.user = null;
      })

      .addCase(meThunk.fulfilled, (s, a) => {
        s.user = a.payload;
        s.isAuthReady = true;
      })
      .addCase(meThunk.rejected, (s) => {
        s.user = null;
        s.isAuthReady = true;
      })

      .addCase(logoutThunk.fulfilled, (s) => {
        s.accessToken = null;
        s.user = null;
      })
      .addCase(logoutThunk.rejected, (s) => {
        s.accessToken = null;
        s.user = null;
      })

      .addCase(bootstrapAuthThunk.fulfilled, (s) => {
        s.isAuthReady = true;
      })
      .addCase(bootstrapAuthThunk.rejected, (s) => {
        s.isAuthReady = true;
      });
  },
});

export const { setAccessToken, clearAuth } = authSlice.actions;
export default authSlice.reducer;
