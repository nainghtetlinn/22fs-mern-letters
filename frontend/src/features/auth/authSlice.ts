import { createSlice, createAsyncThunk, isAnyOf } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import authService from './authService';

const token = JSON.parse(localStorage.getItem('user') as string);

type initialStateTypes = {
  user: any;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  msg: string;
};
const initialState: initialStateTypes = {
  user: token ? { token } : null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  msg: '',
};

export const signup = createAsyncThunk(
  'auth/signup',
  async (userData: any, thunkApi) => {
    try {
      return await authService.signup(userData);
    } catch (err) {
      const error = err as AxiosError;
      const { message } = error.response?.data as any;
      return thunkApi.rejectWithValue(message);
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (userData: any, thunkApi) => {
    try {
      return await authService.login(userData);
    } catch (err) {
      const error = err as AxiosError;
      const { message } = error.response?.data as any;
      return thunkApi.rejectWithValue(message);
    }
  }
);

export const loginWithToken = createAsyncThunk(
  'auth/token',
  async (_, thunkApi) => {
    try {
      return await authService.token();
    } catch (err) {
      const error = err as AxiosError;
      const { message } = error.response?.data as any;
      return thunkApi.rejectWithValue(message);
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  await authService.logout();
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: state => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.msg = '';
    },
  },
  extraReducers: builder => {
    builder
      .addCase(logout.fulfilled, state => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = false;
        state.msg = '';
        state.user = null;
      })
      .addMatcher(
        isAnyOf(signup.pending, login.pending, loginWithToken.pending),
        state => {
          state.isLoading = true;
          state.isError = false;
          state.isSuccess = false;
          state.msg = '';
        }
      )
      .addMatcher(
        isAnyOf(signup.fulfilled, login.fulfilled, loginWithToken.fulfilled),
        (state, action) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.isError = false;
          state.msg = '';
          state.user = action.payload;
        }
      )
      .addMatcher(
        isAnyOf(signup.rejected, login.rejected, loginWithToken.rejected),
        (state, action) => {
          state.isLoading = false;
          state.isSuccess = false;
          state.isError = true;
          state.msg = (action.payload as string) || 'Something went wrong';
        }
      );
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
