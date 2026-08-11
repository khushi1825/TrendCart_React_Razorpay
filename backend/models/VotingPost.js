const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema(
  {
    friendId: {
      type: String,
      required: true
    },

    friendName: {
      type: String,
      required: true
    },

    vote: {
      type: String,
      enum: ['like', 'dislike', 'excellent'],
      required: true
    },

    votedAt: {
      type: Date,
      default: Date.now
    }
  },
  { _id: false }
);

const votingPostSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },

    productName: {
      type: String,
      required: true
    },

    productImage: {
      type: String,
      default: ''
    },

    productPrice: {
      type: Number,
      required: true
    },

    addedBy: {
      type: String,
      required: true
    },

    friends: [
      {
        friendId: String,
        friendName: String
      }
    ],

    votes: [voteSchema]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  'VotingPost',
  votingPostSchema
);