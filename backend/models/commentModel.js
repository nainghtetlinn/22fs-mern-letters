const mongoose = require('mongoose');

const commentSchema = mongoose.Schema(
  {
    text: {
      type: String,
      require: [true, 'Please add your comment text'],
    },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Comment', commentSchema);
