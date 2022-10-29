const asyncHandler = require('express-async-handler');

const User = require('../models/userModel');
const Post = require('../models/postModel');
const Comment = require('../models/commentModel');
const getAccess = require('../utils/getAccess');

const likePost = asyncHandler(async (req, res) => {
  const post = await Post.findOne({
    _id: req.params.id,
    likes: { $nin: req.user.id },
  });
  if (!post) {
    res.status(400);
    throw new Error('Post not found or you already liked the post');
  }

  if (await getAccess(post.privacy, post.user.toString(), req.user.id)) {
    post.likes.push(req.user.id);
    post.save();

    await User.findOneAndUpdate(
      { _id: req.user.id },
      { $push: { likedPosts: post.id } }
    );

    res
      .status(200)
      .json({ post: { _id: post.id }, user: { _id: req.user.id } });
  } else {
    res.status(401);
    throw new Error("You don't have access to the post");
  }
});

const undoLikePost = asyncHandler(async (req, res) => {
  const result = await Post.findOneAndUpdate(
    { _id: req.params.id, likes: req.user.id },
    { $pull: { likes: req.user.id } }
  );
  if (!result) {
    res.status(400);
    throw new Error('Post not found or you already unliked the post');
  }
  await User.findOneAndUpdate(
    { _id: req.user.id },
    { $pull: { likedPosts: result.id } }
  );
  res
    .status(200)
    .json({ post: { _id: result.id }, user: { _id: req.user.id } });
});

const likeComment = asyncHandler(async (req, res) => {
  const result = await Comment.findOneAndUpdate(
    { _id: req.params.id, likes: { $nin: req.user.id } },
    { $push: { likes: req.user.id } },
    { new: true, runValidators: true }
  );
  if (!result) {
    res.status(400);
    throw new Error('Comment not found or you already liked the comment');
  }
  await User.findOneAndUpdate(
    { _id: req.user.id },
    { $push: { likedComments: result.id } }
  );
  res
    .status(200)
    .json({ comment: { _id: result.id }, user: { _id: req.user.id } });
});

const undoLikeComment = asyncHandler(async (req, res) => {
  const result = await Comment.findOneAndUpdate(
    { _id: req.params.id, likes: { $in: req.user.id } },
    { $pull: { likes: req.user.id } }
  );
  if (!result) {
    res.status(400);
    throw new Error('Comment not found or you already unliked the comment');
  }
  await User.findOneAndUpdate(
    { _id: req.user.id },
    { $pull: { likedComments: result.id } }
  );
  res
    .status(200)
    .json({ comment: { _id: result.id }, user: { _id: req.user.id } });
});

module.exports = { likePost, undoLikePost, likeComment, undoLikeComment };
