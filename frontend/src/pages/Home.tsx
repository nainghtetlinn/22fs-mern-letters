import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Stack, Container } from '@mui/material';

import { AppDispatch, RootState } from '../app/store';
import {
  reset,
  fetchFeedsPosts,
  createPost,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
} from '../features/posts/postsSlice';
import { showMessage } from '../features/alert/alertSlice';
import { postSchema } from '../schemas/postSchema';
import { isLiked } from '../utils';

import Post from '../components/Post/Post';
import ConfirmDeletePost from '../components/Post/ConfirmDeletePost';
import EditPostEl from '../components/Post/EditPostEl';
import NewPost from '../components/home/NewPost';

import LoadingPost from '../components/UI/LoadingPost';

export const Home: React.FC = () => {
  console.log('home');
  const dispatch = useDispatch<AppDispatch>();
  const { userId, isSuccess: isLoggedIn } = useSelector(
    (store: RootState) => store.auth
  );
  const { posts, isLoading, isError, msg } = useSelector(
    (store: RootState) => store.posts
  );

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(reset());
      dispatch(fetchFeedsPosts());
    }
  }, [isLoggedIn, dispatch]);

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
          {isLoading && (
            <>
              <LoadingPost />
              <LoadingPost />
              <LoadingPost />
            </>
          )}
          {!isLoading &&
            posts.map(post => (
              <Post key={post._id} post={post} userId={userId as string} />
            ))}
        </Stack>
      </Container>
    </>
  );
};
