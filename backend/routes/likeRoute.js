const express = require('express');
const router = express.Router();

const {
  likePost,
  undoLikePost,
  likeComment,
  undoLikeComment,
} = require('../controllers/likeController');

// /api/likes/
router.route('/post/:id').post(likePost).delete(undoLikePost);
router.route('/comment/:id').post(likeComment).delete(undoLikeComment);

module.exports = router;
