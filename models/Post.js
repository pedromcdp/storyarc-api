const mongoose = require('mongoose');

const PostSchema = mongoose.Schema(
  {
    postType: {
      type: String,
      default: 'foto',
    },
    description: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      required: true,
    },
    newPhoto: {
      type: String,
      default: null,
    },
    streetName: {
      type: String,
    },
    coordinates: {
      type: Array,
    },
    contentDate: {
      type: Number,
    },
    user: {
      type: mongoose.SchemaTypes.String,
      ref: 'Users',
      required: true,
    },
    comments: {
      type: [
        { type: mongoose.SchemaTypes.ObjectId, ref: 'Comments', default: null },
      ],
    },
    likes: {
      type: [
        { type: mongoose.SchemaTypes.String, ref: 'Users', default: null },
      ],
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Posts', PostSchema);
