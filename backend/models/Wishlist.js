const mongoose = require('mongoose');

const wishlistItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },

    name: {
      type: String,
      required: true
    },

    price: {
      type: Number,
      required: true
    },

    images: {
      type: [String],
      default: []
    },

    category: {
      type: String,
      default: ''
    }
  },
  { _id: false }
);

const wishlistSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },

    items: {
      type: [wishlistItemSchema],
      default: []
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  'Wishlist',
  wishlistSchema
);