import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import {
  Stack,
  Button,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Container,
  InputBase,
} from '@mui/material';

import HomeIcon from '@mui/icons-material/Home';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';

import { RootState, AppDispatch } from '../../app/store';
import { logout } from '../../features/auth/authSlice';

const NavMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const { userId } = useSelector((store: RootState) => store.auth);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      {userId && (
        <Container
          maxWidth='xs'
          sx={{
            display: { xs: 'none', sm: 'block' },
            padding: 0,
          }}
        >
          <InputBase
            sx={{
              background: 'white',
              px: 1,
              borderRadius: 1,
            }}
            fullWidth
            placeholder='Search'
            startAdornment={<SearchOutlinedIcon />}
          ></InputBase>
        </Container>
      )}

      <Stack direction='row' alignItems='center'>
        {userId && (
          <>
            <IconButton
              sx={{ display: { xs: 'flex', sm: 'none' } }}
              color='inherit'
              onClick={() => {
                navigate('/search');
              }}
            >
              <SearchOutlinedIcon />
            </IconButton>
            <IconButton color='inherit' onClick={() => navigate('/')}>
              {location.pathname === '/' ? <HomeIcon /> : <HomeOutlinedIcon />}
            </IconButton>
            <IconButton
              color='inherit'
              onClick={event => setAnchorEl(event.currentTarget)}
            >
              <Avatar sx={{ width: 24, height: 24 }}></Avatar>
            </IconButton>
            <Menu
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              anchorEl={anchorEl}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: 'visible',
                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                  mt: 1,
                  '&:before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: 'background.paper',
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0,
                  },
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem onClick={() => navigate(`/profile/${userId}`)}>
                <ListItemIcon>
                  <AccountCircleOutlinedIcon />
                </ListItemIcon>
                <ListItemText>Profile</ListItemText>
              </MenuItem>
              <MenuItem onClick={() => dispatch(logout())}>
                <ListItemIcon>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText>Log Out</ListItemText>
              </MenuItem>
            </Menu>
          </>
        )}

        {!userId && (
          <>
            <Button
              size='small'
              color='inherit'
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
            <Button
              size='small'
              color='inherit'
              onClick={() => navigate('/signup')}
            >
              SignUp
            </Button>
          </>
        )}
      </Stack>
    </>
  );
};

export default NavMenu;
