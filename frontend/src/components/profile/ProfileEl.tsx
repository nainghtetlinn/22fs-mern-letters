import {
  styled,
  Paper,
  Box,
  IconButton,
  Stack,
  Typography,
  Avatar,
} from '@mui/material';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../app/store';
import {
  reset,
  requestFollow,
  cancelRequest,
  unfollow,
} from '../../features/user/userSlice';

import Requests from './Requests';
import ConfirmUnfollow from './ConfirmUnfollow';
import List from './List';
import Post from '../Post/Post';

const Btn = styled('button')({
  background: 'none',
  outline: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: '0',
});

type Props = {
  userId: string;
};

const ProfileEl = ({ userId }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    _id: profileId,
    name,
    followers,
    followings,
    pendingRequests,
    posts,
  } = useSelector((store: RootState) => store.profile);
  const [showComfirmBox, setShowComfirmBox] = useState(false);
  const [showFollowersList, setShowFollowersList] = useState(false);
  const [showFollowingsList, setShowFollowingsList] = useState(false);

  const handleFollow = () => {
    dispatch(reset());
    dispatch(requestFollow(profileId));
  };
  const handleCancel = () => {
    dispatch(reset());
    dispatch(cancelRequest(profileId));
  };
  const handleUnfollow = () => {
    dispatch(reset());
    dispatch(unfollow(profileId));
    setShowComfirmBox(false);
  };
  return (
    <>
      <List
        open={showFollowersList}
        close={() => setShowFollowersList(false)}
        title='followers'
        lists={followers}
      />
      <List
        open={showFollowingsList}
        close={() => setShowFollowingsList(false)}
        title='followings'
        lists={followings}
      />
      <ConfirmUnfollow
        show={showComfirmBox}
        closeConfirmBox={() => setShowComfirmBox(false)}
        name={name}
        handleUnfollow={handleUnfollow}
      />
      <Paper sx={{ padding: 1.5 }}>
        <Stack direction='row' alignItems='center' spacing={1.5}>
          <Stack spacing={1.5}>
            <Avatar
              sx={{ width: { xs: 50, sm: 70 }, height: { xs: 50, sm: 70 } }}
            />
          </Stack>
          <Box>
            <Stack
              direction='row'
              alignItems='center'
              spacing={1.5}
              sx={{ margin: '0 0 8px' }}
            >
              <Typography
                sx={{ fontSize: { xs: '20px', sm: '24px' }, fontWeight: 500 }}
              >
                {name}
              </Typography>
              {userId !== profileId && (
                <>
                  {followers.length > 0 &&
                  followers.filter(follower => follower._id === userId).length >
                    0 ? (
                    <IconButton
                      size='small'
                      onClick={() => setShowComfirmBox(true)}
                    >
                      <PeopleAltIcon fontSize='inherit' />
                    </IconButton>
                  ) : pendingRequests.length > 0 ? (
                    <IconButton size='small' onClick={handleCancel}>
                      <HourglassBottomIcon fontSize='inherit' />
                    </IconButton>
                  ) : (
                    <IconButton size='small' onClick={handleFollow}>
                      <PersonAddAlt1Icon fontSize='inherit' />
                    </IconButton>
                  )}
                </>
              )}
            </Stack>
            <Stack direction='row' alignItems='center' spacing={1.5}>
              <Btn sx={{ fontSize: { xs: '12px', sm: '14px' } }}>
                {posts.length} posts
              </Btn>
              <Btn
                onClick={() => setShowFollowersList(true)}
                sx={{ fontSize: { xs: '12px', sm: '14px' } }}
              >
                {followers.length} followers
              </Btn>
              <Btn
                onClick={() => setShowFollowingsList(true)}
                sx={{ fontSize: { xs: '12px', sm: '14px' } }}
              >
                {followings.length} followings
              </Btn>
            </Stack>
          </Box>
        </Stack>
      </Paper>
      {profileId === userId && <Requests requests={pendingRequests} />}
      {posts.length > 0 &&
        posts.map(post => <Post key={post._id} post={post} userId={userId} />)}
    </>
  );
};

export default ProfileEl;
