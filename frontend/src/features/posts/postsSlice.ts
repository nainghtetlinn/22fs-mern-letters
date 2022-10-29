import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import postsService from './postsService';
import reactionService from './reactionService';

type stateType = {
  posts: any[];
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  msg: string;
};
const initialState: stateType = {
  posts: [],
  isLoading: false,
  isSuccess: false,
  isError: false,
  msg: '',
};

export const fetchFeedsPosts = createAsyncThunk(
  'posts/feeds',
  async (_, thunkApi) => {
    try {
      return await postsService.getFeeds();
    } catch (err) {
      const error = err as AxiosError;
      const { message } = error.response?.data as any;
      return thunkApi.rejectWithValue(message);
    }
  }
);
export const createPost = createAsyncThunk(
  'posts/create',
  async (postData: { text: string; privacy: string }, thunkApi) => {
    try {
      return await postsService.createPost(postData);
    } catch (err) {
      const error = err as AxiosError;
      const { message } = error.response?.data as any;
      return thunkApi.rejectWithValue(message);
    }
  }
);
export const updatePost = createAsyncThunk(
  'posts/update',
  async (
    {
      postData,
      postId,
    }: { postData: { text: string; privacy: string }; postId: string },
    thunkApi
  ) => {
    try {
      return await postsService.updatePost(postId, postData);
    } catch (err) {
      const error = err as AxiosError;
      const { message } = error.response?.data as any;
      return thunkApi.rejectWithValue(message);
    }
  }
);
export const deletePost = createAsyncThunk(
  'posts/delete',
  async (postId: string, thunkApi) => {
    try {
      return await postsService.deletePost(postId);
    } catch (err) {
      const error = err as AxiosError;
      const { message } = error.response?.data as any;
      return thunkApi.rejectWithValue(message);
    }
  }
);

export const likePost = createAsyncThunk(
  'posts/like',
  async (postId: string, thunkApi) => {
    try {
      return await reactionService.likePost(postId);
    } catch (err) {
      const error = err as AxiosError;
      const { message } = error.response?.data as any;
      return thunkApi.rejectWithValue(message);
    }
  }
);
export const unlikePost = createAsyncThunk(
  'posts/unlike',
  async (postId: string, thunkApi) => {
    try {
      return await reactionService.unlikePost(postId);
    } catch (err) {
      const error = err as AxiosError;
      const { message } = error.response?.data as any;
      return thunkApi.rejectWithValue(message);
    }
  }
);

const postsSlice = createSlice({
  name: 'posts',
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
      .addCase(fetchFeedsPosts.pending, state => {
        state.isLoading = true;
      })
      .addCase(fetchFeedsPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.posts = action.payload;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.posts = [action.payload, ...state.posts];
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.posts = state.posts.map(post => {
          if (post._id === action.payload._id) {
            return action.payload;
          }
          return post;
        });
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.posts = state.posts.filter(post => {
          return post._id !== action.payload._id;
        });
      })
      .addCase(likePost.fulfilled, (state, action) => {
        state.posts = state.posts.map(post => {
          if (post._id === action.payload.post._id) {
            return { ...post, likes: [...post.likes, action.payload.user._id] };
          }
          return post;
        });
      })
      .addCase(unlikePost.fulfilled, (state, action) => {
        state.posts = state.posts.map(post => {
          if (post._id === action.payload.post._id) {
            return {
              ...post,
              likes: post.likes.filter(
                (like: any) => like !== action.payload.user._id
              ),
            };
          }
          return post;
        });
      })
      .addMatcher(
        isAnyOf(
          fetchFeedsPosts.rejected,
          createPost.rejected,
          updatePost.rejected,
          deletePost.rejected,
          likePost.rejected,
          unlikePost.rejected
        ),
        (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.msg = (action.payload as string) || 'Something went wrong';
        }
      );
  },
});

export const { reset } = postsSlice.actions;
export default postsSlice.reducer;
