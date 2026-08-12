const mongoose = require('mongoose');

const friendSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    friendId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    name: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true
    },

    mobile: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

friendSchema.index(
  { userId: 1, friendId: 1 },
  { unique: true }
);

module.exports = mongoose.model('Friend', friendSchema);