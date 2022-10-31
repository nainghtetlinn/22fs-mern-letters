import {
  Container,
  AppBar,
  Toolbar,
  IconButton,
  InputBase,
  Box,
  Divider,
  Stack,
  Typography,
  Avatar,
  styled,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../app/store';
import useDebounce from '../hooks/useDebounce';
import { setString, searchQuery } from '../features/search/searchSlice';

import Post from '../components/Post/Post';

const Btn = styled('button')({
  background: 'none',
  outline: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: '0',
  fontSize: '14px',
});

export const Search: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { posts, users } = useSelector((store: RootState) => store.search);
  const { userId } = useSelector((store: RootState) => store.auth);

  const [search, setSearch] = useState('');
  const debouncedSearchTerm = useDebounce(search, 500);

  useEffect(() => {
    if (debouncedSearchTerm) {
      dispatch(searchQuery(debouncedSearchTerm));
      dispatch(setString(debouncedSearchTerm));
    }
  }, [debouncedSearchTerm, dispatch]);

  return (
    <>
      <Box sx={{ backgroundColor: '#eeeeee', minHeight: '100vh' }}>
        <AppBar
          sx={{ backgroundColor: 'white' }}
          elevation={0}
          position='fixed'
          color='transparent'
        >
          <Toolbar>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              <IconButton
                color='primary'
                size='small'
                onClick={() => navigate(-1)}
              >
                <ArrowBackIcon />
              </IconButton>
              <InputBase
                placeholder='Search'
                value={search}
                onChange={e => setSearch(e.target.value)}
                sx={{
                  background: 'white',
                  flexGrow: 1,
                  borderRadius: 1,
                  px: '4px',
                }}
              />
            </Box>
          </Toolbar>
        </AppBar>
        <Toolbar />
        <Divider />
        <div style={{ height: '12px' }}></div>
        <Container maxWidth='xs' sx={{ padding: 0, minHeight: '80vh' }}>
          <Stack sx={{ margin: '0 0 12px' }}>
            {users &&
              users.length > 0 &&
              users.map(user => (
                <Stack
                  key={user._id}
                  direction='row'
                  alignItems='center'
                  spacing={1}
                >
                  <Box sx={{ padding: 1 }}>
                    <Avatar />
                  </Box>
                  <Btn onClick={() => navigate(`/profile/${user._id}`)}>
                    {user.name}
                  </Btn>
                </Stack>
              ))}
          </Stack>
          <Stack spacing={2}>
            {posts &&
              posts.length > 0 &&
              posts.map(post => (
                <Post key={post._id} post={post} userId={userId as string} />
              ))}
          </Stack>
        </Container>
        <Box sx={{ padding: 1 }}>
          <Typography textAlign='center'>
            2022 &copy; | Naing Htet Linn
          </Typography>
        </Box>
      </Box>
    </>
  );
};
