const express = require('express');
const router = express.Router();

const {
  getFeeds,
  getUserPosts,
  getPost,
  setPost,
  updatePost,
  deletePost,
} = require('../controllers/postController');

router.route('/').post(setPost).get(getUserPosts);
router.route('/feeds').get(getFeeds);
router.route('/:id').put(updatePost).delete(deletePost).get(getPost);

module.exports = router;
