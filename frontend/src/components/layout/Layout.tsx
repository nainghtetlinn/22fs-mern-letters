import { Outlet } from 'react-router-dom';

import { Box, Container, Typography } from '@mui/material';

import Header from './Header';

const Layout = () => {
  return (
    <>
      <Box sx={{ backgroundColor: '#eeeeee', minHeight: '100vh' }}>
        <Header />
        <Container maxWidth='lg' sx={{ padding: 0 }}>
          <Outlet />
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

export default Layout;
