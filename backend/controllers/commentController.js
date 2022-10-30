const asyncHandler = require('express-async-handler');
const Joi = require('joi');

const Comment = require('../models/commentModel');
const User = require('../models/userModel');
const Post = require('../models/postModel');
const getAccess = require('../utils/getAccess');
const { cleanComment } = require('../utils/cleanCollection');

const validateComment = Joi.string().required();

// GET /api/comments?postId=
const getPostComments = asyncHandler(async (req, res) => {
  const { postId } = req.query;
  const comments = await Comment.find({ post: postId }).populate({
    path: 'user',
    select: 'name',
  });
  res.status(200).json(comments);
});

// POST /api/comments
const setComment = asyncHandler(async (req, res) => {
  const { value, error } = validateComment.validate(req.body.text);
  if (error) {
    res.status(400);
    throw new Error(error);
  }

  const post = await Post.findOne({ _id: req.body.postId });
  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  if (await getAccess(post.privacy, post.user.toString(), req.user.id)) {
    const comment = await Comment.create({
      text: value,
      post: req.body.postId,
      user: req.user.id,
    });
    await comment.populate([{ path: 'user', select: 'name' }]);
    if (!comment) {
      res.status(500);
      throw new Error('Something went wrong');
    }
    await User.findOneAndUpdate(
      { _id: req.user.id },
      { $push: { comments: comment.id } }
    );
    await Post.findOneAndUpdate(
      { _id: req.body.postId },
      { $push: { comments: comment.id } }
    );
    res.status(201).json(comment);
  } else {
    res.status(401);
    throw new Error("You don't have access to the post");
  }
});

// PUT /api/comments/:id
const updateComment = asyncHandler(async (req, res) => {
  const { value, error } = validateComment.validate(req.body.text);
  if (error) {
    res.status(400);
    throw new Error(error);
  }

  const comment = await Comment.findOneAndUpdate(
    {
      _id: req.params.id,
      user: req.user.id,
    },
    { text: value },
    { new: true, runValidators: true }
  ).populate({ path: 'user', select: 'name' });
  if (!comment) {
    res.status(400);
    throw new Error(
      "Comment not found or you don't have access to update comment"
    );
  }
  res.status(200).json(comment);
});

// DELETE /api/comments/:id
const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) {
    res.status(404);
    throw new Error('Comment not found');
  }

  if (
    req.user.id === comment.user.toString() ||
    (await User.findOne({ _id: req.user.id, posts: { $in: comment.post } }))
  ) {
    const comment = await Comment.findOneAndDelete({
      _id: req.params.id,
    });
    if (!comment) {
      res.status(500);
      throw new Error('Something went wrong');
    }
    cleanComment(comment.id);
    res.status(200).json(comment);
  } else {
    res.status(401);
    throw new Error("You don't have access to delete the comment");
  }
});

module.exports = { getPostComments, setComment, updateComment, deleteComment };
