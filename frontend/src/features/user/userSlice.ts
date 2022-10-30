import { createSlice, createAsyncThunk, isAnyOf } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import userService from './userService';

type stateType = {
  _id: string;
  name: string;
  email: string;
  followers: any[];
  followings: any[];
  pendingRequests: any[];
  posts: any[];
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  msg: string;
};
const initialState: stateType = {
  _id: '',
  name: 'username',
  email: '',
  followers: [],
  followings: [],
  pendingRequests: [],
  posts: [],
  isLoading: false,
  isSuccess: false,
  isError: false,
  msg: '',
};

export const getUserProfile = createAsyncThunk(
  'user/profile',
  async (userId: string, thunkApi) => {
    try {
      return await userService.getUserPosts(userId);
    } catch (err) {
      const error = err as AxiosError;
      const { message } = error.response?.data as any;
      return thunkApi.rejectWithValue(message);
    }
  }
);
export const requestFollow = createAsyncThunk(
  'follow/request',
  async (userId: string, thunkApi) => {
    try {
      return await userService.requestFollow(userId);
    } catch (err) {
      const error = err as AxiosError;
      const { message } = error.response?.data as any;
      return thunkApi.rejectWithValue(message);
    }
  }
);
export const cancelRequest = createAsyncThunk(
  'follow/cancel',
  async (userId: string, thunkApi) => {
    try {
      return await userService.calcelRequest(userId);
    } catch (err) {
      const error = err as AxiosError;
      const { message } = error.response?.data as any;
      return thunkApi.rejectWithValue(message);
    }
  }
);
export const unfollow = createAsyncThunk(
  'follow/unfollow',
  async (userId: string, thunkApi) => {
    try {
      return await userService.unfollow(userId);
    } catch (err) {
      const error = err as AxiosError;
      const { message } = error.response?.data as any;
      return thunkApi.rejectWithValue(message);
    }
  }
);
export const acceptRequest = createAsyncThunk(
  'follow/accept',
  async (userId: string, thunkApi) => {
    try {
      return await userService.acceptRequest(userId);
    } catch (err) {
      const error = err as AxiosError;
      const { message } = error.response?.data as any;
      return thunkApi.rejectWithValue(message);
    }
  }
);
export const rejectRequest = createAsyncThunk(
  'follow/reject',
  async (userId: string, thunkApi) => {
    try {
      return await userService.rejectRequest(userId);
    } catch (err) {
      const error = err as AxiosError;
      const { message } = error.response?.data as any;
      return thunkApi.rejectWithValue(message);
    }
  }
);

const userSlice = createSlice({
  name: 'userprofile',
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
      .addCase(getUserProfile.pending, state => {
        state.isLoading = true;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        const {
          _id,
          name,
          email,
          followers,
          followings,
          pendingRequests,
          posts,
        } = action.payload;
        state.isLoading = false;
        state.isSuccess = true;
        state._id = _id;
        state.name = name;
        state.email = email;
        state.followers = followers;
        state.followings = followings;
        state.pendingRequests = pendingRequests;
        state.posts = posts;
      })
      .addCase(requestFollow.fulfilled, (state, action) => {
        state.pendingRequests = [action.payload.from];
      })
      .addCase(cancelRequest.fulfilled, (state, action) => {
        state.pendingRequests = [];
      })
      .addCase(unfollow.fulfilled, (state, action) => {
        state.followers = state.followers.filter(
          follower => follower._id !== action.payload.from._id
        );
      })
      .addCase(acceptRequest.fulfilled, (state, action) => {
        state.followers = [...state.followers, action.payload.to];
        state.pendingRequests = state.pendingRequests.filter(
          reqs => reqs._id !== action.payload.to._id
        );
      })
      .addCase(rejectRequest.fulfilled, (state, action) => {
        state.pendingRequests = state.pendingRequests.filter(
          reqs => reqs._id !== action.payload.to._id
        );
      })
      .addMatcher(
        isAnyOf(
          getUserProfile.rejected,
          requestFollow.rejected,
          cancelRequest.rejected,
          unfollow.rejected,
          acceptRequest.rejected,
          rejectRequest.rejected
        ),
        (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.msg = action.payload as string;
        }
      );
  },
});

export const { reset } = userSlice.actions;
export default userSlice.reducer;
