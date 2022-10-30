import {
  styled,
  Paper,
  IconButton,
  Avatar,
  Stack,
  Box,
  Typography,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';

import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../app/store';
import {
  reset,
  acceptRequest,
  rejectRequest,
} from '../../features/user/userSlice';

const Btn = styled('button')({
  background: 'none',
  outline: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: '0',
  fontSize: '16px',
});

type Props = {
  requests: any[];
};

const Requests = ({ requests }: Props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const handleAccept = (userId: string) => {
    dispatch(reset());
    dispatch(acceptRequest(userId));
  };
  const handleReject = (userId: string) => {
    dispatch(reset());
    dispatch(rejectRequest(userId));
  };

  return (
    <>
      <Paper sx={{ padding: 1.5 }}>
        <Typography variant='subtitle1' gutterBottom>
          Requests {requests.length > 0 && ': ' + requests.length}
        </Typography>

        {requests.length === 0 && (
          <Typography variant='body2'>No new requests</Typography>
        )}
        <Stack spacing={1}>
          {requests.length > 0 &&
            requests.map(req => {
              return (
                <Stack
                  key={req._id}
                  direction='row'
                  alignItems='center'
                  spacing={1.5}
                >
                  <Box>
                    <Avatar />
                  </Box>
                  <Stack
                    direction='row'
                    alignItems='center'
                    justifyContent='space-between'
                    sx={{ width: '100%' }}
                  >
                    <Btn onClick={() => navigate(`/profile/${req._id}`)}>
                      {req.name}
                    </Btn>
                    <Stack direction='row' alignItems='center'>
                      <IconButton
                        color='primary'
                        onClick={() => handleAccept(req._id)}
                      >
                        <CheckIcon fontSize='inherit' />
                      </IconButton>
                      <IconButton
                        color='error'
                        onClick={() => handleReject(req._id)}
                      >
                        <ClearIcon fontSize='inherit' />
                      </IconButton>
                    </Stack>
                  </Stack>
                </Stack>
              );
            })}
        </Stack>
      </Paper>
    </>
  );
};

export default Requests;
