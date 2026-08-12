const express = require('express');
const Wishlist = require('../models/Wishlist');

const router = express.Router();


// ============================================
// GET WISHLIST
// GET /api/wishlist/:userId
// ============================================
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    let wishlist = await Wishlist.findOne({
      userId
    });

    if (!wishlist) {
      wishlist = await Wishlist.create({
        userId,
        items: []
      });
    }

    res.status(200).json(wishlist.items);

  } catch (error) {
    console.error(
      'Get wishlist error:',
      error
    );

    res.status(500).json({
      error: 'Failed to fetch wishlist'
    });
  }
});


// ============================================
// ADD TO WISHLIST
// POST /api/wishlist/:userId
// ============================================
router.post('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const {
      productId,
      name,
      price,
      images,
      category
    } = req.body;

    if (!productId) {
      return res.status(400).json({
        error: 'Product ID is required'
      });
    }

    let wishlist = await Wishlist.findOne({
      userId
    });

    if (!wishlist) {
      wishlist = new Wishlist({
        userId,
        items: []
      });
    }

    const exists = wishlist.items.some(
      item =>
        String(item.productId) ===
        String(productId)
    );

    if (!exists) {
      wishlist.items.push({
        productId,
        name,
        price: Number(price),
        images: images || [],
        category: category || ''
      });
    }

    await wishlist.save();

    console.log(
      'Wishlist updated for user:',
      userId
    );

    res.status(200).json(wishlist.items);

  } catch (error) {
    console.error(
      'Add wishlist error:',
      error
    );

    res.status(500).json({
      error: 'Failed to add to wishlist'
    });
  }
});


// ============================================
// REMOVE FROM WISHLIST
// DELETE /api/wishlist/:userId/:productId
// ============================================
router.delete(
  '/:userId/:productId',
  async (req, res) => {
    try {
      const {
        userId,
        productId
      } = req.params;

      const wishlist =
        await Wishlist.findOne({
          userId
        });

      if (!wishlist) {
        return res.status(404).json({
          error: 'Wishlist not found'
        });
      }

      wishlist.items =
        wishlist.items.filter(
          item =>
            String(item.productId) !==
            String(productId)
        );

      await wishlist.save();

      res.status(200).json(
        wishlist.items
      );

    } catch (error) {
      console.error(
        'Remove wishlist error:',
        error
      );

      res.status(500).json({
        error:
          'Failed to remove from wishlist'
      });
    }
  }
);


router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Wishlist route is working'
  });
});



module.exports = router;