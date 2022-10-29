import {
  styled,
  Avatar,
  Box,
  Stack,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../../app/store';
import {
  reset,
  likeComment,
  unlikeComment,
} from '../../../features/comments/commentsSlice';
import { formatDate, isLiked } from '../../../utils';

import ConfirmDeleteComment from './ConfirmDeleteComment';

const SeeMore = styled('span')({
  boxShadow: 'none',
  textTransform: 'none',
  fontSize: 14,
  fontWeight: 'bold',
  padding: '0 0 0 4px',
  border: 'none',
  color: 'black',
  cursor: 'pointer',
  '&:hover': {
    background: 'none',
  },
});

type Props = {
  comment: any;
  updateComment: () => void;
  creatorId: string;
};

const CommentEl = ({ comment, updateComment, creatorId }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const { _id: userId } = useSelector((store: RootState) => store.auth.user);
  const { _id: commentId, text, user, createdAt, likes } = comment;

  const [seeMore, setSeeMore] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const closeMenu = () => setAnchorEl(null);

  const handleLike = () => {
    dispatch(reset());
    if (isLiked(userId, likes)) {
      dispatch(unlikeComment(commentId));
    } else {
      dispatch(likeComment(commentId));
    }
  };

  return (
    <>
      <Box sx={{ display: 'flex', margin: '0 0 8px' }}>
        <Box sx={{ marginRight: 2 }}>
          <Avatar />
        </Box>
        <Box>
          <Box
            sx={{
              backgroundColor: '#eeeeee',
              padding: '2px 8px',
              borderRadius: 1,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Typography variant='subtitle2'>{user.name}</Typography>
              {(userId === user._id || creatorId === userId) && (
                <IconButton
                  size='small'
                  onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                    setAnchorEl(event.currentTarget);
                  }}
                >
                  <MoreVertIcon fontSize='inherit' />
                </IconButton>
              )}
            </Box>
            {!seeMore && (
              <Typography variant='body1'>
                {text.slice(0, 150)}
                {text.length > 150 && (
                  <SeeMore onClick={() => setSeeMore(true)}>See more.</SeeMore>
                )}
              </Typography>
            )}
            {seeMore && (
              <Typography variant='body1' onClick={() => setSeeMore(false)}>
                {text}
              </Typography>
            )}
          </Box>
          <Stack direction='row' alignItems='center' spacing={0.5}>
            <Typography variant='body2' fontSize={11}>
              {formatDate(createdAt)}
            </Typography>
            <IconButton size='small' onClick={handleLike}>
              {isLiked(userId, likes) ? (
                <FavoriteIcon color='error' />
              ) : (
                <FavoriteBorderIcon />
              )}
            </IconButton>
            <Typography variant='body2' fontSize={11}>
              {likes.length} likes
            </Typography>
          </Stack>
        </Box>
      </Box>
      <Menu
        open={open}
        onClose={closeMenu}
        onClick={closeMenu}
        anchorEl={anchorEl}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1,
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => setShowConfirm(true)}>
          <ListItemIcon>
            <DeleteIcon />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
        {userId === user._id && (
          <MenuItem onClick={updateComment}>
            <ListItemIcon>
              <EditIcon />
            </ListItemIcon>
            <ListItemText>Edit</ListItemText>
          </MenuItem>
        )}
      </Menu>
      <ConfirmDeleteComment
        show={showConfirm}
        closeConfirmBox={() => setShowConfirm(false)}
        commentId={commentId}
      />
    </>
  );
};

export default CommentEl;
