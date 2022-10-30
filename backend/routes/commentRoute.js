const express = require('express');
const router = express.Router();

const {
  getPostComments,
  setComment,
  updateComment,
  deleteComment,
} = require('../controllers/commentController');

// /api/comments/
router.route('/').post(setComment).get(getPostComments);
router.route('/:id').put(updateComment).delete(deleteComment);

module.exports = router;
