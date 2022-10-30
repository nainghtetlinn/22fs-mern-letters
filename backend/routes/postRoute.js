const express = require('express');
const router = express.Router();

const {
  getFeeds,
  getPost,
  setPost,
  updatePost,
  deletePost,
} = require('../controllers/postController');

// /api/posts/
router.route('/').post(setPost);
router.route('/feeds').get(getFeeds);
router.route('/:id').put(updatePost).delete(deletePost).get(getPost);

module.exports = router;
