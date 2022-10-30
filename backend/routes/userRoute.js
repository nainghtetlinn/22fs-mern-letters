const express = require('express');
const router = express.Router();

const {
  registerUser,
  loginUser,
  loginWithToken,
  getUserProfile,
} = require('../controllers/userController');

const { protect } = require('../middlewares/authMiddleware');

// /api/users/
router.route('/').post(registerUser);
router.route('/login').post(loginUser);
router.route('/token').get(protect, loginWithToken);
router.route('/profile/:id').get(protect, getUserProfile);

module.exports = router;
