const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const Joi = require('joi');

const User = require('../models/userModel');

const validateRegister = Joi.object({
  name: Joi.string().min(5).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
    .min(5)
    .required(),
  confirmPassword: Joi.string()
    .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
    .min(5)
    .required(),
});
const validateLogin = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string()
    .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
    .min(5)
    .required(),
});

const registerUser = asyncHandler(async (req, res) => {
  const { value, error } = validateRegister.validate(req.body);
  if (error) {
    res.status(400);
    throw new Error(error.message);
  }
  const { name, email, password, confirmPassword } = value;
  if (password !== confirmPassword) {
    res.status(400);
    throw new Error("Confirm password doesn't match with your password");
  }

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({ name, email, password: hashedPassword });
  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user.id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { value, error } = validateLogin.validate(req.body);
  if (error) {
    res.status(400);
    throw new Error(error);
  }
  const { email, password } = value;

  // Check for user email
  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error('User does not found');
  }

  if (user && (await bcrypt.compare(password, user.password))) {
    res.status(200).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user.id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid credentials');
  }
});

const loginWithToken = asyncHandler(async (req, res) => {
  const id = req.user.id;
  const user = await User.findById(id);

  if (!user) {
    res.status(404);
    throw new Error('User does not found');
  }

  res.status(200).json({
    _id: user.id,
    name: user.name,
    email: user.email,
    token: generateToken(user.id),
  });
});

const getUserProfile = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const reqUserId = req.user.id;

  if (reqUserId === userId) {
    const user = await User.findById(userId)
      .populate([
        {
          path: 'posts',
          populate: { path: 'user', select: 'name' },
        },
        { path: 'followers', select: 'name' },
        { path: 'followings', select: 'name' },
        { path: 'pendingRequests', select: 'name' },
      ])
      .select('name email');
    res.status(200).json(user);
    return;
  }

  const result = await User.findOne({ _id: userId, followers: reqUserId });
  if (result) {
    const user = await User.findById(userId)
      .populate([
        {
          path: 'posts',
          match: { privacy: { $ne: 'private' } },
          populate: { path: 'user', select: 'name' },
        },
        { path: 'followers', select: 'name' },
        { path: 'followings', select: 'name' },
        {
          path: 'pendingRequests',
          select: 'name',
          match: {
            _id: reqUserId,
          },
        },
      ])
      .select('name email');
    res.status(200).json(user);
  } else {
    const user = await User.findById(userId)
      .populate([
        {
          path: 'posts',
          match: { privacy: 'public' },
          populate: { path: 'user', select: 'name' },
        },
        { path: 'followers', select: 'name' },
        { path: 'followings', select: 'name' },
        {
          path: 'pendingRequests',
          select: 'name',
          match: {
            _id: reqUserId,
          },
        },
      ])
      .select('name email');
    res.status(200).json(user);
  }
});

const generateToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

module.exports = { registerUser, loginUser, loginWithToken, getUserProfile };
