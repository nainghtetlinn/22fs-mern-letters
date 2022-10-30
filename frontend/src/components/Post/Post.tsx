import { useState } from 'react';

import PostEl from './PostEl';
import ConfirmDeletePost from './ConfirmDeletePost';
import EditPostEl from './EditPostEl';
import Comment from '../Comment/Comment';

type Props = {
  post: any;
  userId: string;
};

const Post = ({ post, userId }: Props) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [showComment, setShowComment] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  return (
    <>
      <PostEl
        post={post}
        userId={userId}
        openCommentBox={() => setShowComment(true)}
        openConfirmBox={() => setShowConfirm(true)}
        openEditBox={() => setShowEdit(true)}
      />
      <ConfirmDeletePost
        show={showConfirm}
        closeConfirmBox={() => setShowConfirm(false)}
        postId={post._id}
      />
      <EditPostEl
        show={showEdit}
        closeEditBox={() => setShowEdit(false)}
        postId={post._id}
        text={post.text}
        privacy={post.privacy}
      />
      <Comment
        show={showComment}
        closeCommentBox={() => setShowComment(false)}
        postId={post._id}
        creatorId={post.user._id}
      />
    </>
  );
};

export default Post;
