import { Button, Dialog, DialogTitle, DialogActions } from '@mui/material';

import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../app/store';

type Props = {
  show: boolean;
  closeConfirmBox: () => void;
  name: string;
  handleUnfollow: () => void;
};

const ConfirmUnfollow = ({
  show,
  closeConfirmBox,
  name,
  handleUnfollow,
}: Props) => {
  return (
    <>
      <Dialog
        open={show}
        onClose={closeConfirmBox}
        fullWidth
        maxWidth='xs'
        PaperProps={{ sx: { margin: 1, width: '100%' } }}
      >
        <DialogTitle>Do you sure want to unfollow {name}</DialogTitle>
        <DialogActions>
          <Button variant='outlined' onClick={closeConfirmBox}>
            Cancel
          </Button>
          <Button variant='contained' color='error' onClick={handleUnfollow}>
            Unfollow
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ConfirmUnfollow;
