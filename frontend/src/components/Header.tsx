import { AppBar, Toolbar, Stack, Typography } from '@mui/material';

import NavMenu from './NavMenu';

const Header = () => {
  return (
    <>
      <AppBar elevation={0} position='fixed'>
        <Toolbar>
          <Stack
            direction='row'
            justifyContent='space-between'
            alignItems='center'
            width='100vw'
          >
            <Typography variant='h5'>Letters</Typography>
            <NavMenu />
          </Stack>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <div style={{ height: '12px' }}></div>
    </>
  );
};

export default Header;
