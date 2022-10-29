import { Button, Dialog, DialogTitle, DialogActions } from '@mui/material';

import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../app/store';
import { reset, deleteComment } from '../../../features/comments/commentsSlice';

type Props = {
  show: boolean;
  closeConfirmBox: () => void;
  commentId: string;
};

const ConfirmDeleteComment = ({ show, closeConfirmBox, commentId }: Props) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleDelete = () => {
    dispatch(reset());
    dispatch(deleteComment(commentId));
    closeConfirmBox();
  };

  return (
    <>
      <Dialog
        open={show}
        onClose={closeConfirmBox}
        fullWidth
        maxWidth='xs'
        PaperProps={{ sx: { margin: 1, width: '100%' } }}
      >
        <DialogTitle>Do you sure want to delete?</DialogTitle>
        <DialogActions>
          <Button variant='outlined' onClick={closeConfirmBox}>
            Cancel
          </Button>
          <Button variant='contained' color='error' onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ConfirmDeleteComment;
