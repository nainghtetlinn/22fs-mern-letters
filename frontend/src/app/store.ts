import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

import authReducer from '../features/auth/authSlice';
import alertReducer from '../features/alert/alertSlice';
import postsReducer from '../features/posts/postsSlice';
import commentsReducer from '../features/comments/commentsSlice';
import userReducer from '../features/user/userSlice';
import searchReducer from '../features/search/searchSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    alert: alertReducer,
    posts: postsReducer,
    comments: commentsReducer,
    profile: userReducer,
    search: searchReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export const useAppDispatch: () => AppDispatch = useDispatch;
