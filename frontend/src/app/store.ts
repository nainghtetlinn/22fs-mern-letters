import { configureStore } from '@reduxjs/toolkit';

import authReducer from '../features/auth/authSlice';
import alertReducer from '../features/alert/alertSlice';
import postsReducer from '../features/posts/postsSlice';
import commentsReducer from '../features/comments/commentsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    alert: alertReducer,
    posts: postsReducer,
    comments: commentsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
