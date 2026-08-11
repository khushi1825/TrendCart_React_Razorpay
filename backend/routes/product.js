const express = require('express');
const Product = require('../models/Product');

const router = express.Router();

// GET ALL PRODUCTS
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({
      isActive: true
    }).sort({ createdAt: -1 });

    res.status(200).json(products);

  } catch (error) {
    console.error('Error fetching products:', error);

    res.status(500).json({
      error: 'Failed to fetch products'
    });
  }
});


// GET SINGLE PRODUCT
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        error: 'Product not found'
      });
    }

    res.status(200).json(product);

  } catch (error) {
    console.error('Error fetching product:', error);

    res.status(500).json({
      error: 'Failed to fetch product'
    });
  }
});

module.exports = router;