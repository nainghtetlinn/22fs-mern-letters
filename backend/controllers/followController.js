const asyncHandler = require('express-async-handler');

const User = require('../models/userModel');

/*
I will explain this scenario using userA and userB
*/

// new request was sent from userA to userB
const requestFollow = asyncHandler(async (req, res) => {
  // From userA **id is taken from token
  const requestUserId = req.user.id;
  // To userB **id is taken from body
  const wasRequestedUserId = req.body.userId;

  if (requestUserId === wasRequestedUserId) {
    res.status(400);
    throw new Error('Something went wrong');
  }
  const user = await User.findById(wasRequestedUserId);
  if (!user) {
    res.status(400);
    throw new Error('User not found');
  }

  const result = await User.findOneAndUpdate(
    {
      _id: wasRequestedUserId,
      pendingRequests: { $nin: requestUserId },
      followers: { $nin: requestUserId },
    },
    { $push: { pendingRequests: requestUserId } },
    { new: true }
  );

  if (!result) {
    res.status(400);
    throw new Error(
      `You already send request or already followed ${user.name}`
    );
  }

  res.status(200).json({
    status: 'success',
    value: {
      from: requestUserId,
      to: wasRequestedUserId,
      message: 'Requested',
    },
  });
});

// userA cancel request to userB
const cancelRequest = asyncHandler(async (req, res) => {
  // From userA **id is taken from token
  const requestUserId = req.user.id;
  // To userB **id is taken from body
  const wasRequestedUserId = req.body.userId;

  if (requestUserId === wasRequestedUserId) {
    res.status(400);
    throw new Error('Something went wrong');
  }
  const user = await User.findById(wasRequestedUserId);
  if (!user) {
    res.status(400);
    throw new Error('User not found');
  }

  const result = await User.findOneAndUpdate(
    { _id: wasRequestedUserId, pendingRequests: { $in: requestUserId } },
    { $pull: { pendingRequests: requestUserId } },
    { new: true }
  );

  if (!result) {
    res.status(400);
    throw new Error(`You already canceled your request from ${user.name}`);
  }

  res.status(200).json({
    status: 'success',
    value: {
      from: requestUserId,
      to: wasRequestedUserId,
      message: 'Canceled',
    },
  });
});

// userA unfollow userB
const unfollow = asyncHandler(async (req, res) => {
  // From userA **id is taken from token
  const requestUserId = req.user.id;
  // To userB **id is taken from body
  const wasRequestedUserId = req.body.userId;

  if (requestUserId === wasRequestedUserId) {
    res.status(400);
    throw new Error('Something went wrong');
  }
  const user = await User.findById(wasRequestedUserId);
  if (!user) {
    res.status(400);
    throw new Error('User not found');
  }

  const result = await User.findOneAndUpdate(
    { _id: wasRequestedUserId, followers: { $in: requestUserId } },
    { $pull: { followers: requestUserId } },
    { new: true }
  );
  if (!result) {
    res.status(400);
    throw new Error(`You already unfollowed ${user.name}`);
  }

  await User.findOneAndUpdate(
    { _id: requestUserId, followings: { $in: wasRequestedUserId } },
    { $pull: { followings: wasRequestedUserId } }
  );

  res.status(200).json({
    status: 'success',
    value: {
      from: requestUserId,
      to: wasRequestedUserId,
      message: 'Unfollowed',
    },
  });
});

// userB accept userA
const acceptFollow = asyncHandler(async (req, res) => {
  // From **is is taken from body
  const requestUserId = req.body.userId;
  // To **id is taken from token
  const wasRequestedUserId = req.user.id;

  if (requestUserId === wasRequestedUserId) {
    res.status(400);
    throw new Error('Something went wrong');
  }
  const user = await User.findById(requestUserId);
  if (!user) {
    res.status(400);
    throw new Error('User not found');
  }

  const result = await User.findOneAndUpdate(
    {
      _id: wasRequestedUserId,
      pendingRequests: { $in: requestUserId },
      followers: { $nin: requestUserId },
    },
    {
      $pull: { pendingRequests: requestUserId },
      $push: { followers: requestUserId },
    },
    { new: true, runValidators: true }
  );

  if (!result) {
    res.status(400);
    throw new Error(
      `You already accepted request from ${user.name} or rejected`
    );
  }

  await User.findOneAndUpdate(
    { _id: requestUserId, followings: { $nin: wasRequestedUserId } },
    { $push: { followings: wasRequestedUserId } }
  );

  res.status(200).json({
    status: 'success',
    value: {
      from: wasRequestedUserId,
      to: requestUserId,
      message: 'Accepted',
    },
  });
});

// userB reject userA
const rejectFollow = asyncHandler(async (req, res) => {
  // From **is is taken from body
  const requestUserId = req.body.userId;
  // To **id is taken from token
  const wasRequestedUserId = req.user.id;

  if (requestUserId === wasRequestedUserId) {
    res.status(400);
    throw new Error('Something went wrong');
  }
  const user = await User.findById(requestUserId);
  if (!user) {
    res.status(400);
    throw new Error('User not found');
  }

  const result = await User.findOneAndUpdate(
    { _id: wasRequestedUserId, pendingRequests: { $in: requestUserId } },
    { $pull: { pendingRequests: requestUserId } },
    { new: true }
  );

  if (!result) {
    res.status(400);
    throw new Error(`You already rejected ${user.name}`);
  }

  res.status(200).json({
    status: 'success',
    value: {
      from: wasRequestedUserId,
      to: requestUserId,
      message: 'Rejected',
    },
  });
});

module.exports = {
  requestFollow,
  cancelRequest,
  unfollow,
  acceptFollow,
  rejectFollow,
};
