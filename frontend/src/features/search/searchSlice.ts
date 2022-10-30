import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit';
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

export const fetchFeedsPosts = createAsyncThunk(
  'posts/feeds',
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
  },
  extraReducers: builder => {
    // builder.addMatcher(isAnyOf(), (state, action) => {});
  },
});

export const { reset } = searchSlice.actions;
export default searchSlice.reducer;
