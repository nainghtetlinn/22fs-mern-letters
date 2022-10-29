import { useSelector, useDispatch } from 'react-redux';
import { Snackbar, Alert } from '@mui/material';

import { RootState, AppDispatch } from '../../app/store';
import { closeMessage } from '../../features/alert/alertSlice';

const AlertMessage = () => {
  const { msg, type, open } = useSelector((store: RootState) => store.alert);
  const dispatch = useDispatch<AppDispatch>();

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    dispatch(closeMessage());
  };
  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          variant='filled'
          severity={type}
          sx={{ width: '100%' }}
        >
          {msg}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AlertMessage;
