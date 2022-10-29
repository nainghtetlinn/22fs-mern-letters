const mongoose = require('mongoose');

const postSchema = mongoose.Schema(
  {
    text: { type: String, required: [true, 'Please add your post text'] },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    privacy: {
      type: String,
      enum: ['public', 'private', 'friends'],
      default: 'public',
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Post', postSchema);
