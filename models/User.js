const mongoose = require('mongoose');

const UserSchema = mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
    },
    savedPosts: {
      type: [
        { type: mongoose.SchemaTypes.ObjectId, ref: 'Posts', default: null },
      ],
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Users', UserSchema);
