const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    sku: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true
    },

    description: {
      type: String,
      default: '',
      trim: true
    },

    brand: {
      type: String,
      default: 'TrendCart',
      trim: true
    },

    category: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },

    subcategory: {
      type: String,
      default: ''
    },

    price: {
      type: Number,
      required: true,
      min: 0
    },

    compareAtPrice: {
      type: Number,
      default: null,
      min: 0
    },

    images: [
      {
        type: String
      }
    ],

    stock: {
      type: Number,
      required: true,
      default: 0,
      min: 0
    },

    sizes: [
      {
        type: String
      }
    ],

    colors: [
      {
        type: String
      }
    ],

    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Useful indexes for e-commerce queries
productSchema.index({
  name: 'text',
  description: 'text',
  brand: 'text'
});

productSchema.index({
  category: 1,
  isActive: 1
});

productSchema.index({
  price: 1
});

module.exports = mongoose.model('Product', productSchema);