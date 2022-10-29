import {
  styled,
  Typography,
  Divider,
  Paper,
  Avatar,
  Stack,
  IconButton,
  CardHeader,
  CardContent,
  CardActions,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PeopleIcon from '@mui/icons-material/People';
import PublicIcon from '@mui/icons-material/Public';
import HttpsIcon from '@mui/icons-material/Https';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../app/store';
import {
  reset,
  likePost,
  unlikePost,
} from '../../../features/posts/postsSlice';
import { formatDate, isLiked } from '../../../utils';

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
const Btn = styled('button')({
  background: 'none',
  outline: 'none',
  border: 'none',
  cursor: 'pointer',
});

type Props = {
  post: any;
  userId: string;
  openCommentBox: () => void;
  openConfirmBox: () => void;
  openEditBox: () => void;
};

const PostEl = ({
  post,
  userId,
  openCommentBox,
  openConfirmBox,
  openEditBox,
}: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, createdAt, text, privacy, likes, comments, _id: postId } = post;

  const [seeMore, setSeeMore] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const closeMenu = () => setAnchorEl(null);

  const handleLike = () => {
    dispatch(reset());
    if (isLiked(userId, likes)) {
      dispatch(unlikePost(postId));
    } else {
      dispatch(likePost(postId));
    }
  };

  return (
    <>
      <Paper>
        <CardHeader
          avatar={<Avatar />}
          action={
            user._id === userId && (
              <IconButton
                onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                  setAnchorEl(event.currentTarget);
                }}
                size='small'
                color='inherit'
              >
                <MoreVertIcon />
              </IconButton>
            )
          }
          title={user.name}
          subheader={
            <Stack direction='row' alignItems='center' spacing={1}>
              <Typography variant='inherit'>{formatDate(createdAt)}</Typography>
              {privacy === 'public' ? (
                <PublicIcon fontSize='inherit' />
              ) : privacy === 'friends' ? (
                <PeopleIcon fontSize='inherit' />
              ) : (
                <HttpsIcon fontSize='inherit' />
              )}
            </Stack>
          }
          titleTypographyProps={{ fontSize: 16 }}
          subheaderTypographyProps={{ fontSize: 11 }}
        />
        <Divider />
        <CardContent>
          {!seeMore && (
            <Typography variant='body2'>
              {text.slice(0, 150)}
              {text.length > 150 && (
                <SeeMore onClick={() => setSeeMore(true)}>See more.</SeeMore>
              )}
            </Typography>
          )}
          {seeMore && (
            <Typography variant='body2' onClick={() => setSeeMore(false)}>
              {text}
            </Typography>
          )}
        </CardContent>

        <CardActions sx={{ pt: '0', display: 'block' }}>
          <Stack direction='row' alignItems='center'>
            <IconButton size='small' onClick={handleLike}>
              {isLiked(userId, likes) ? (
                <FavoriteIcon color='error' />
              ) : (
                <FavoriteBorderIcon />
              )}
            </IconButton>
            <IconButton size='small' onClick={openCommentBox}>
              <ChatBubbleOutlineOutlinedIcon />
            </IconButton>
          </Stack>
          <Btn>
            <Typography variant='subtitle2'>{likes.length} likes</Typography>
          </Btn>
          <Btn onClick={openCommentBox}>
            <Typography variant='subtitle2' sx={{ color: 'gray' }}>
              View all {comments.length} comments
            </Typography>
          </Btn>
        </CardActions>
      </Paper>
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
        <MenuItem onClick={openConfirmBox}>
          <ListItemIcon>
            <DeleteIcon />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
        <MenuItem onClick={openEditBox}>
          <ListItemIcon>
            <EditIcon />
          </ListItemIcon>
          <ListItemText>Edit post</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export default PostEl;
