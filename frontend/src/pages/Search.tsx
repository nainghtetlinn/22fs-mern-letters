import { useNavigate } from 'react-router-dom';
import {
  Container,
  AppBar,
  Toolbar,
  IconButton,
  InputBase,
  Box,
  Divider,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export const Search: React.FC = () => {
  const navigate = useNavigate();
  return (
    <>
      <AppBar elevation={0} position='fixed' color='transparent'>
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
      <Container maxWidth='lg' sx={{ padding: 0 }}>
        Search Result
      </Container>
    </>
  );
};
