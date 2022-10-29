const asyncHandler = require('express-async-handler');
const Joi = require('joi');

const Post = require('../models/postModel');
const User = require('../models/userModel');
const getAccess = require('../utils/getAccess');
const { cleanPost } = require('../utils/cleanCollection');

const getFeeds = asyncHandler(async (req, res) => {
  const reqUserId = req.user.id;
  const reqUser = await User.findById(reqUserId);

  const feeds = await Post.find({
    $or: [
      { privacy: 'public' },
      { privacy: 'friends', user: { $in: reqUser.followings } },
      { privacy: 'friends', user: reqUserId },
      { privacy: 'private', user: reqUserId },
    ],
  })
    .sort({ _id: -1 })
    .populate({ path: 'user', select: 'name' });

  if (!feeds) {
    res.status(400);
    throw new Error();
  }

  res.status(200).json(feeds);
});

// GET /api/posts
const getUserPosts = asyncHandler(async (req, res) => {
  const reqUserId = req.user.id;
  const userId = req.body.userId;

  const posts = await Post.find({ user: userId }).populate([
    { path: 'user', select: 'name' },
    { path: 'likes', select: 'name' },
  ]);

  if (reqUserId === userId) {
    res.status(200).json(posts);
    return;
  }

  const result = await User.findOne({ _id: userId, followers: reqUserId });
  if (result) {
    res.status(200).json(posts.filter(post => post.privacy !== 'private'));
  } else {
    res.status(200).json(posts.filter(post => post.privacy === 'public'));
  }
});

// GET /api/posts/:id
const getPost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id).populate([
    { path: 'user', select: 'name' },
    { path: 'likes', select: 'name' },
    {
      path: 'comments',
      select: 'text user likes',
      populate: [
        { path: 'user', select: 'name' },
        { path: 'likes', select: 'name' },
      ],
    },
  ]);

  if (await getAccess(post.privacy, post.user.id.toString(), req.user.id)) {
    res.status(200).json(post);
  } else {
    res.status(401);
    throw new Error("You don't have access to the post");
  }
});

const validatePost = Joi.object({
  text: Joi.string().required(),
  privacy: Joi.string(),
});
// POST /api/posts
const setPost = asyncHandler(async (req, res) => {
  const { value, error } = validatePost.validate(req.body);
  if (error) {
    res.status(400);
    throw new Error(error.message);
  }
  const { text, privacy } = value;

  const post = await Post.create({ text, privacy, user: req.user.id });
  if (!post) {
    res.status(500);
    throw new Error('Something went wrong');
  }
  post.populate({ path: 'user', select: 'name' });
  await User.findByIdAndUpdate(
    req.user.id,
    { $push: { posts: post.id } },
    { runValidators: true }
  );

  res.status(201).json(post);
});

// PUT /api/posts/:id
const updatePost = asyncHandler(async (req, res) => {
  const { value, error } = validatePost.validate(req.body);
  if (error) {
    res.status(400);
    throw new Error(error.message);
  }

  const result = await Post.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    value,
    { new: true, runValidators: true }
  ).populate({ path: 'user', select: 'name' });
  if (!result) {
    res.status(404);
    throw new Error('Post not found');
  }

  res.status(200).json(result);
});

// DELETE /api/posts/:id
const deletePost = asyncHandler(async (req, res) => {
  const result = await Post.findOneAndDelete({
    _id: req.params.id,
    user: req.user.id,
  });
  if (!result) {
    res.status(404);
    throw new Error('Post not found');
  }

  cleanPost(result.id, result.comments);
  res.status(200).json(result);
});

module.exports = {
  getUserPosts,
  getPost,
  setPost,
  updatePost,
  deletePost,
  getFeeds,
};
