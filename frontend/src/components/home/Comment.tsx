import {
  Stack,
  IconButton,
  Divider,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Joi from 'joi';
import { AppDispatch, RootState } from '../../app/store';
import {
  reset,
  fetchComments,
  createComment,
  updateComment,
} from '../../features/comments/commentsSlice';
import { showMessage } from '../../features/alert/alertSlice';
import CommentEl from './Comment/CommentEl';
import LoadingComment from '../UI/LoadingComment';

const commentSchema = Joi.string().required();

type Props = {
  show: boolean;
  closeCommentBox: () => void;
  postId: string;
  creatorId: string;
};

const Comment = ({ show, closeCommentBox, postId, creatorId }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const { comments, isLoading, isSuccess, isError, msg } = useSelector(
    (store: RootState) => store.comments
  );

  const [commentText, setCommentText] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [editComment, setEditComment] = useState({
    isEditing: false,
    commentId: '',
  });

  const handleComment = () => {
    const { value, error } = commentSchema.validate(commentText);
    if (error) {
      dispatch(showMessage({ type: 'error', msg: error.message }));
      return;
    }
    if (editComment.isEditing) {
      setIsCreating(true); // to disable send button tho it's not creating
      dispatch(reset());
      dispatch(
        updateComment({
          commentId: editComment.commentId,
          commentData: { text: value },
        })
      );
      return;
    }
    setIsCreating(true);
    dispatch(reset());
    dispatch(createComment({ text: value, postId }));
  };

  useEffect(() => {
    if (isSuccess) {
      setCommentText('');
      setIsCreating(false);
      setEditComment({ commentId: '', isEditing: false });
    }
  }, [isSuccess]);

  useEffect(() => {
    if (show) {
      dispatch(reset());
      dispatch(fetchComments(postId));
    }
  }, [show, postId, dispatch]);
  useEffect(() => {
    if (isError) {
      dispatch(showMessage({ type: 'error', msg }));
    }
  }, [isError, msg, dispatch]);

  return (
    <>
      <Dialog
        open={show}
        onClose={closeCommentBox}
        fullWidth
        maxWidth='xs'
        PaperProps={{ sx: { margin: 1, width: '100%' } }}
      >
        <DialogTitle>
          <Stack
            direction='row'
            alignItems='center'
            justifyContent='space-between'
          >
            Comments
            <IconButton onClick={closeCommentBox}>
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent sx={{ overflowY: 'scroll', maxHeight: '300px' }}>
          {isLoading && (
            <>
              <LoadingComment />
              <LoadingComment />
              <LoadingComment />
            </>
          )}
          {!isLoading && comments.length === 0 && <div>No comments yet</div>}
          {!isLoading &&
            comments.length > 0 &&
            comments.map(comment => (
              <CommentEl
                key={comment._id}
                comment={comment}
                updateComment={() => {
                  setEditComment({
                    ...updateComment,
                    isEditing: true,
                    commentId: comment._id,
                  });
                  setCommentText(comment.text);
                }}
                creatorId={creatorId}
              />
            ))}
          {isCreating && !editComment.isEditing && <LoadingComment />}
        </DialogContent>
        <Divider />
        <DialogActions>
          <TextField
            value={commentText}
            onChange={e => setCommentText(e.target.value)}
            placeholder='Comment'
            multiline
            fullWidth
            autoFocus
            maxRows={3}
            variant='standard'
          />
          <IconButton
            color='primary'
            disabled={isCreating}
            onClick={handleComment}
          >
            <SendIcon />
          </IconButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Comment;
