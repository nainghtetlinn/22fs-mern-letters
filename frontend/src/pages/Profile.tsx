import { Container, Stack } from '@mui/material';

import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../app/store';
import { reset, getUserProfile } from '../features/user/userSlice';
import { showMessage } from '../features/alert/alertSlice';

import ProfileEl from '../components/profile/ProfileEl';

export const Profile: React.FC = () => {
  const { id } = useParams();
  const { userId, isSuccess: isLogin } = useSelector(
    (store: RootState) => store.auth
  );
  const { isError, msg } = useSelector((store: RootState) => store.profile);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (isLogin) {
      dispatch(reset());
      dispatch(getUserProfile(id as string));
    }
  }, [isLogin, dispatch, id]);

  useEffect(() => {
    if (isError) {
      dispatch(showMessage({ type: 'error', msg }));
    }
  }, [isError, msg, dispatch]);
  return (
    <>
      <Container maxWidth='xs'>
        <Stack spacing={2}>
          <ProfileEl userId={userId as string} />
        </Stack>
      </Container>
    </>
  );
};
