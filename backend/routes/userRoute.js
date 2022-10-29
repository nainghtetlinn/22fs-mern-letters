const express = require('express');
const router = express.Router();

const {
  registerUser,
  loginUser,
  getMe,
  loginWithToken,
} = require('../controllers/userController');

const { protect } = require('../middlewares/authMiddleware');

router.route('/').post(registerUser);
router.route('/login').post(loginUser);
router.route('/token').post(protect, loginWithToken);
router.route('/me').get(protect, getMe);

module.exports = router;
