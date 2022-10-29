import {
  Button,
  Select,
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../app/store';
import { reset, updatePost } from '../../../features/posts/postsSlice';
import { showMessage } from '../../../features/alert/alertSlice';

import { postSchema } from '../../../schemas/postSchema';

type Props = {
  show: boolean;
  closeEditBox: () => void;
  privacy: string;
  text: string;
  postId: string;
};

const EditPostEl = ({ show, closeEditBox, privacy, text, postId }: Props) => {
  const dispatch = useDispatch<AppDispatch>();

  const [newValues, setNewValues] = useState({
    text,
    privacy,
  });

  const handleUpdate = () => {
    const { value, error } = postSchema.validate(newValues);
    if (error) {
      dispatch(showMessage({ type: 'error', msg: error.message }));
      return;
    }
    dispatch(reset());
    dispatch(updatePost({ postData: value, postId }));
    setNewValues({ text, privacy });
    closeEditBox();
  };

  return (
    <>
      <Dialog
        open={show}
        onClose={closeEditBox}
        fullWidth
        maxWidth='xs'
        PaperProps={{ sx: { margin: 1, width: '100%' } }}
      >
        <DialogTitle>Editing</DialogTitle>
        <DialogContent>
          <Select
            size='small'
            sx={{ mb: 1 }}
            defaultValue={privacy}
            onChange={e =>
              setNewValues({ ...newValues, privacy: e.target.value })
            }
          >
            <MenuItem value='public'>Public</MenuItem>
            <MenuItem value='friends'>Friends</MenuItem>
            <MenuItem value='private'>Private</MenuItem>
          </Select>
          <TextField
            defaultValue={text}
            onChange={e => setNewValues({ ...newValues, text: e.target.value })}
            multiline
            fullWidth
            autoFocus
            variant='standard'
          />
        </DialogContent>
        <DialogActions>
          <Button variant='outlined' onClick={closeEditBox}>
            Cancel
          </Button>
          <Button variant='contained' onClick={handleUpdate}>
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EditPostEl;
