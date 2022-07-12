const mongoose = require('mongoose');

const NotificationSchema = mongoose.Schema(
  {
    fromUser: {
      type: mongoose.SchemaTypes.String,
      ref: 'Users',
      required: true,
    },
    toUser: {
      type: mongoose.SchemaTypes.String,
      ref: 'Users',
      required: true,
    },
    post: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Posts',
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Notification', NotificationSchema);
