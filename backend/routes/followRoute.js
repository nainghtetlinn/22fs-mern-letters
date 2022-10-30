const express = require('express');
const router = express.Router();

const {
  requestFollow,
  cancelRequest,
  unfollow,
  acceptFollow,
  rejectFollow,
} = require('../controllers/followController');

// /api/follow/
router.route('/request').post(requestFollow);
router.route('/cancel').post(cancelRequest);
router.route('/unfollow').post(unfollow);
router.route('/accept').post(acceptFollow);
router.route('/reject').post(rejectFollow);

module.exports = router;
