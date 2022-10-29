import { createSlice, createAsyncThunk, isAnyOf } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import commentsService from './commentsService';

type stateType = {
  comments: any[];
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  msg: string;
};
const initialState: stateType = {
  comments: [],
  isLoading: false,
  isSuccess: false,
  isError: false,
  msg: '',
};

export const fetchComments = createAsyncThunk(
  'comments/fetch',
  async (postId: string, thunkApi) => {
    try {
      return await commentsService.fetchComments(postId);
    } catch (err) {
      const error = err as AxiosError;
      const { message } = error.response?.data as any;
      return thunkApi.rejectWithValue(message);
    }
  }
);
export const createComment = createAsyncThunk(
  'comments/create',
  async (commentData: { text: string; postId: string }, thunkApi) => {
    try {
      return await commentsService.createComment(commentData);
    } catch (err) {
      const error = err as AxiosError;
      const { message } = error.response?.data as any;
      return thunkApi.rejectWithValue(message);
    }
  }
);
export const updateComment = createAsyncThunk(
  'comments/update',
  async (
    { commentId, commentData }: { commentId: string; commentData: any },
    thunkApi
  ) => {
    try {
      return await commentsService.updateComment(commentId, commentData);
    } catch (err) {
      const error = err as AxiosError;
      const { message } = error.response?.data as any;
      return thunkApi.rejectWithValue(message);
    }
  }
);
export const deleteComment = createAsyncThunk(
  'comments/delete',
  async (commentId: string, thunkApi) => {
    try {
      return await commentsService.deleteComment(commentId);
    } catch (err) {
      const error = err as AxiosError;
      const { message } = error.response?.data as any;
      return thunkApi.rejectWithValue(message);
    }
  }
);
export const likeComment = createAsyncThunk(
  'comments/like',
  async (commentId: string, thunkApi) => {
    try {
      return await commentsService.likeComment(commentId);
    } catch (err) {
      const error = err as AxiosError;
      const { message } = error.response?.data as any;
      return thunkApi.rejectWithValue(message);
    }
  }
);
export const unlikeComment = createAsyncThunk(
  'comments/unlike',
  async (commentId: string, thunkApi) => {
    try {
      return await commentsService.unlikeComment(commentId);
    } catch (err) {
      const error = err as AxiosError;
      const { message } = error.response?.data as any;
      return thunkApi.rejectWithValue(message);
    }
  }
);

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    reset: state => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.msg = '';
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchComments.pending, state => {
        state.isLoading = true;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.comments = action.payload;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.comments = [...state.comments, action.payload];
      })
      .addCase(updateComment.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.comments = state.comments.map(comment => {
          if (comment._id === action.payload._id) {
            return action.payload;
          }
          return comment;
        });
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.comments = state.comments.filter(comment => {
          return comment._id !== action.payload._id;
        });
      })
      .addCase(likeComment.fulfilled, (state, action) => {
        state.comments = state.comments.map(comment => {
          if (comment._id === action.payload.comment._id) {
            return {
              ...comment,
              likes: [...comment.likes, action.payload.user._id],
            };
          }
          return comment;
        });
      })
      .addCase(unlikeComment.fulfilled, (state, action) => {
        state.comments = state.comments.map(comment => {
          if (comment._id === action.payload.comment._id) {
            return {
              ...comment,
              likes: comment.likes.filter(
                (like: any) => like !== action.payload.user._id
              ),
            };
          }
          return comment;
        });
      })
      .addMatcher(
        isAnyOf(
          fetchComments.rejected,
          createComment.rejected,
          updateComment.rejected,
          deleteComment.rejected,
          unlikeComment.rejected,
          likeComment.rejected
        ),
        (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.msg = (action.payload as string) || 'Something went wrong';
        }
      );
  },
});

export const { reset } = commentsSlice.actions;
export default commentsSlice.reducer;
