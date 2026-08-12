const express = require('express');
const Friend = require('../models/Friend');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// =====================================================
// GET MY FRIENDS
// =====================================================

router.get('/', authMiddleware, async (req, res) => {
  try {
    const friends = await Friend.find({
      userId: req.userId
    }).sort({
      createdAt: -1
    });

    res.json(friends);

  } catch (error) {
    console.error('Get friends error:', error);

    res.status(500).json({
      error: 'Failed to fetch friends'
    });
  }
});

// =====================================================
// ADD FRIEND
// =====================================================

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { email, mobile } = req.body;

    if (!email) {
      return res.status(400).json({
        error: 'Friend email is required'
      });
    }

    // Find friend account
    const friendUser = await User.findOne({
      email: email.trim().toLowerCase()
    });

    if (!friendUser) {
      return res.status(404).json({
        error: 'Friend account not found'
      });
    }

    // Don't allow adding yourself
    if (String(friendUser._id) === String(req.userId)) {
      return res.status(400).json({
        error: 'You cannot add yourself as a friend'
      });
    }

    // Check duplicate
    const existingFriend = await Friend.findOne({
      userId: req.userId,
      friendId: friendUser._id
    });

    if (existingFriend) {
      return res.status(400).json({
        error: 'Friend already added'
      });
    }

    const friend = await Friend.create({
      userId: req.userId,
      friendId: friendUser._id,
      name: friendUser.name,
      email: friendUser.email,
      mobile: mobile || ''
    });

    res.status(201).json(friend);

  } catch (error) {
    console.error('Add friend error:', error);

    res.status(500).json({
      error: 'Failed to add friend'
    });
  }
});

// =====================================================
// REMOVE FRIEND
// =====================================================

router.delete('/:friendId', authMiddleware, async (req, res) => {
  try {
    const deletedFriend = await Friend.findOneAndDelete({
      userId: req.userId,
      friendId: req.params.friendId
    });

    if (!deletedFriend) {
      return res.status(404).json({
        error: 'Friend not found'
      });
    }

    res.json({
      success: true,
      message: 'Friend removed successfully'
    });

  } catch (error) {
    console.error('Remove friend error:', error);

    res.status(500).json({
      error: 'Failed to remove friend'
    });
  }
});

module.exports = router;