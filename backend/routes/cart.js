const express = require('express');
const Cart = require('../models/Cart');

const router = express.Router();

// ============================================
// GET CART
// GET /api/cart/:userId
// ============================================
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = await Cart.create({
        userId,
        items: []
      });
    }

    res.status(200).json(cart.items);

  } catch (error) {
    console.error('Get cart error:', error);

    res.status(500).json({
      error: 'Failed to fetch cart'
    });
  }
});


// ============================================
// ADD TO CART
// POST /api/cart/:userId
// ============================================
router.post('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const {
      productId,
      name,
      price,
      image,
      quantity
    } = req.body;

    if (!productId) {
      return res.status(400).json({
        error: 'Product ID is required'
      });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,
        items: []
      });
    }

    const existingItem = cart.items.find(
      item =>
        String(item.productId) === String(productId)
    );

    if (existingItem) {
      existingItem.quantity += Number(quantity) || 1;
    } else {
      cart.items.push({
        productId,
        name,
        price: Number(price),
        image: image || '',
        quantity: Number(quantity) || 1
      });
    }

    await cart.save();

    console.log(
      'Cart updated for user:',
      userId
    );

    res.status(200).json(cart.items);

  } catch (error) {
    console.error('Add cart error:', error);

    res.status(500).json({
      error: 'Failed to add item to cart'
    });
  }
});


// ============================================
// UPDATE QUANTITY
// PUT /api/cart/:userId/:productId
// ============================================
router.put('/:userId/:productId', async (req, res) => {
  try {
    const {
      userId,
      productId
    } = req.params;

    const { quantity } = req.body;

    const cart = await Cart.findOne({
      userId
    });

    if (!cart) {
      return res.status(404).json({
        error: 'Cart not found'
      });
    }

    const item = cart.items.find(
      item =>
        String(item.productId) ===
        String(productId)
    );

    if (!item) {
      return res.status(404).json({
        error: 'Item not found in cart'
      });
    }

    if (Number(quantity) <= 0) {
      cart.items = cart.items.filter(
        item =>
          String(item.productId) !==
          String(productId)
      );
    } else {
      item.quantity = Number(quantity);
    }

    await cart.save();

    res.status(200).json(cart.items);

  } catch (error) {
    console.error(
      'Update cart error:',
      error
    );

    res.status(500).json({
      error: 'Failed to update cart'
    });
  }
});


// ============================================
// REMOVE ITEM
// DELETE /api/cart/:userId/:productId
// ============================================
router.delete('/:userId/:productId', async (req, res) => {
  try {
    const {
      userId,
      productId
    } = req.params;

    const cart = await Cart.findOne({
      userId
    });

    if (!cart) {
      return res.status(404).json({
        error: 'Cart not found'
      });
    }

    cart.items = cart.items.filter(
      item =>
        String(item.productId) !==
        String(productId)
    );

    await cart.save();

    res.status(200).json(cart.items);

  } catch (error) {
    console.error(
      'Remove cart item error:',
      error
    );

    res.status(500).json({
      error: 'Failed to remove item'
    });
  }
});

router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Cart route is working'
  });
});


module.exports = router;