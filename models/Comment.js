const mongoose = require('mongoose');

const CommentSchema = mongoose.Schema(
  {
    postId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Posts',
      required: true,
    },
    user: {
      type: mongoose.SchemaTypes.String,
      ref: 'Users',
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Comments', CommentSchema);
