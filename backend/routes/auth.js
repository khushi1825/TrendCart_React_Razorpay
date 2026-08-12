const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// =====================================================
// SIGNUP
// =====================================================

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        error: 'User already exists'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Store JWT in HttpOnly cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: false, // true in production with HTTPS
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(201).json({
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Signup error:', error);

    res.status(500).json({
      error: 'Server Error'
    });
  }
});


// =====================================================
// LOGIN
// =====================================================

router.post('/login', async (req, res) => {
  try {
    const { emailOrName, password } = req.body;

    const user = await User.findOne({
      $or: [
        { email: emailOrName },
        { name: emailOrName }
      ]
    });

    if (!user) {
      return res.status(400).json({
        error: 'Invalid credentials'
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        error: 'Invalid credentials'
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Store JWT in HttpOnly cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: false, // true in production with HTTPS
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    // IMPORTANT:
    // token is NOT returned to frontend
    res.json({
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Login error:', error);

    res.status(500).json({
      error: 'Server Error'
    });
  }
});


// =====================================================
// LOGOUT
// =====================================================

router.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: false,
    sameSite: 'lax'
  });

  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});


// =====================================================
// FIND USER BY EMAIL
// =====================================================

router.get('/user-by-email/:email', async (req, res) => {
  try {
    const email = decodeURIComponent(req.params.email);

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        error: 'Friend account not found'
      });
    }

    res.json({
      id: user._id.toString(),
      name: user.name,
      email: user.email
    });

  } catch (error) {
    console.error('Find user error:', error);

    res.status(500).json({
      error: 'Server Error'
    });
  }
});


// =====================================================
// GET CURRENT LOGGED-IN USER
// =====================================================

router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .select('_id name email');

    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    res.json({
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error(
      'Get current user error:',
      error
    );

    res.status(500).json({
      error: 'Failed to fetch user'
    });
  }
});


module.exports = router;