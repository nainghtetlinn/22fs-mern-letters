import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import searchService from './searchService';

type stateType = {
  s: string;
  users: any[];
  posts: any[];
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  msg: string;
};
const initialState: stateType = {
  s: '',
  users: [],
  posts: [],
  isLoading: false,
  isSuccess: false,
  isError: false,
  msg: '',
};

export const searchQuery = createAsyncThunk(
  'search',
  async (s: string, thunkApi) => {
    try {
      return await searchService.search(s);
    } catch (err) {
      const error = err as AxiosError;
      const { message } = error.response?.data as any;
      return thunkApi.rejectWithValue(message);
    }
  }
);

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    reset: state => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.msg = '';
    },
    setString: (state, action) => {
      state.s = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(searchQuery.pending, state => {
        state.isLoading = true;
      })
      .addCase(searchQuery.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        console.log(action.payload);
        state.posts = action.payload.posts;
        state.users = action.payload.users;
      })
      .addCase(searchQuery.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.msg = (action.payload as string) || 'Something went wrong';
      });
  },
});

export const { reset, setString } = searchSlice.actions;
export default searchSlice.reducer;
