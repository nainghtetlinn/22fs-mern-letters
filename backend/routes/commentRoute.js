const express = require('express');
const router = express.Router();

const {
  getPostComment,
  setComment,
  updateComment,
  deleteComment,
} = require('../controllers/commentController');

router.route('/').post(setComment).get(getPostComment);
router.route('/:id').put(updateComment).delete(deleteComment);

module.exports = router;
