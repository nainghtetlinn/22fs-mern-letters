const asyncHandler = require('express-async-handler');
const Joi = require('joi');

const Post = require('../models/postModel');
const User = require('../models/userModel');
const getAccess = require('../utils/getAccess');

const search = asyncHandler(async (req, res) => {
  const s = req.query.s;

  const users = await User.find({ name: { $regex: s } });
  const posts = await Post.find({ text: { $regex: s } });
  res.status(200).json({ posts, users });
});

module.exports = { search };
