import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Paper,
  TextField,
  CardContent,
  CardActions,
  Button,
  Select,
  MenuItem,
  Divider,
} from '@mui/material';

import { AppDispatch, RootState } from '../../app/store';
import { createPost, reset } from '../../features/posts/postsSlice';
import { showMessage } from '../../features/alert/alertSlice';

import { postSchema } from '../../schemas/postSchema';

import LoadingPosts from '../UI/LoadingPost';

const NewPost = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isSuccess } = useSelector((store: RootState) => store.posts);

  const [privacy, setPrivacy] = useState('public');
  const [text, setText] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleChange = (e: React.ChangeEvent | any) => {
    setPrivacy(e.target.value);
  };

  const handleSubmit = () => {
    const { value, error } = postSchema.validate({ text, privacy });
    if (error) {
      dispatch(showMessage({ type: 'error', msg: error.message }));
      return;
    }
    setIsCreating(true);
    dispatch(reset());
    dispatch(createPost(value));
  };

  useEffect(() => {
    if (isSuccess) {
      setText('');
      setPrivacy('public');
      setIsCreating(false);
    }
  }, [isSuccess]);

  return (
    <>
      <Paper sx={{ position: 'relative' }}>
        <CardContent>
          <TextField
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder='Write your letter'
            multiline
            fullWidth
            variant='standard'
            InputProps={{ disableUnderline: true }}
          />
        </CardContent>
        <Divider />
        <CardActions>
          <Select
            sx={{ mr: 1 }}
            size='small'
            value={privacy}
            onChange={handleChange}
          >
            <MenuItem value='public'>Public</MenuItem>
            <MenuItem value='friends'>Friends</MenuItem>
            <MenuItem value='private'>Private</MenuItem>
          </Select>
          <Button
            disabled={isCreating}
            onClick={handleSubmit}
            variant='contained'
          >
            Post
          </Button>
        </CardActions>
      </Paper>
      {isCreating && <LoadingPosts />}
    </>
  );
};

export default NewPost;
