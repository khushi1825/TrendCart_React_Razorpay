const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// SIGNUP
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check existing user
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        error: 'User already exists'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    // JWT Token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email
}
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: 'Server Error'
    });
  }
});



// LOGIN
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

    res.json({
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: 'Server Error'
    });
  }
});

// FIND USER BY EMAIL
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
    console.error(error);

    res.status(500).json({
      error: 'Server Error'
    });
  }
});

module.exports = router;