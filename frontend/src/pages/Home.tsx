import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Stack, Container } from '@mui/material';

import { AppDispatch, RootState } from '../app/store';
import { fetchFeedsPosts, reset } from '../features/posts/postsSlice';
import { showMessage } from '../features/alert/alertSlice';

import Post from '../components/home/Post';
import NewPost from '../components/home/NewPost';
import LoadingPost from '../components/UI/LoadingPost';

export const Home: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isSuccess: isLogin, user } = useSelector(
    (store: RootState) => store.auth
  );
  const { posts, isLoading, isError, msg } = useSelector(
    (store: RootState) => store.posts
  );

  useEffect(() => {
    if (isLogin) {
      dispatch(reset());
      dispatch(fetchFeedsPosts());
    }
  }, [isLogin, dispatch]);
  useEffect(() => {
    if (isError) {
      dispatch(showMessage({ type: 'error', msg }));
    }
  }, [isError, msg, dispatch]);

  return (
    <>
      <Container maxWidth='xs' sx={{ padding: 0 }}>
        <Stack direction='column' spacing={2}>
          <NewPost />
          {isLoading && <LoadingPost />}
          {isLoading && <LoadingPost />}
          {isLoading && <LoadingPost />}
          {!isLoading &&
            posts.map(post => (
              <Post key={post._id} post={post} userId={user._id} />
            ))}
        </Stack>
      </Container>
    </>
  );
};
