const asyncHandler = require('express-async-handler');

const User = require('../models/userModel');
const Post = require('../models/postModel');
const Comment = require('../models/commentModel');

const cleanPost = asyncHandler(async (postId, comments) => {
  await User.findOneAndUpdate({ posts: postId }, { $pull: { posts: postId } });
  await User.updateMany(
    { likedPosts: postId },
    { $pull: { likedPosts: postId } }
  );
  await User.updateMany(
    { comments: { $in: comments } },
    { $pull: { comments: { $in: comments } } }
  );
  await User.updateMany(
    { likedComments: { $in: comments } },
    { $pull: { likedComments: { $in: comments } } }
  );
  await Comment.deleteMany({ post: postId });
});

const cleanComment = asyncHandler(async commentId => {
  await User.findOneAndUpdate(
    { comments: commentId },
    { $pull: { comments: commentId } }
  );
  await User.updateMany(
    { likedComments: commentId },
    { $pull: { likedComments: commentId } }
  );
  await Post.findOneAndUpdate(
    { comments: commentId },
    { $pull: { comments: commentId } }
  );
});

module.exports = { cleanPost, cleanComment };
