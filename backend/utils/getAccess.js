const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

const getAccess = asyncHandler(async (postPrivacy, authorId, reqUserId) => {
  if (postPrivacy === 'public' || authorId === reqUserId) {
    return true;
  }
  const isFriends = await User.findOne({
    _id: authorId,
    followers: { $in: reqUserId },
  });

  if (postPrivacy === 'friends' && isFriends) {
    return true;
  }
  return false;
});

module.exports = getAccess;
