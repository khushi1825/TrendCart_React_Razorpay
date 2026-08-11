const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const productRoutes = require('./routes/product');


require('dotenv').config();

const app = express();

// ============================================
// MIDDLEWARE
// ============================================

app.use(cors());//change by khushi

app.use(express.json());

// ============================================
// PRODUCT ROUTES
// ============================================

app.use('/api/products', productRoutes);

// ============================================
// MONGODB CONNECTION
// ============================================

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB Connected');
  })
  .catch((err) => {
    console.error('❌ MongoDB Error:', err);
  });

// ============================================
// USER MODEL
// ============================================

const userSchema = new mongoose.Schema({
  name: String,

  email: {
    type: String,
    unique: true
  },

  password: String
});

const User = mongoose.model('User', userSchema);

// ============================================
// SIGNUP
// ============================================

app.post('/api/signup', async (req, res) => {
  try {

    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });

    if (existing) {
      return res.status(400).json({
        error: 'User already exists'
      });
    }

    const user = await User.create({
      name,
      email,
      password
    });

    res.json({
      success: true,
      user
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: err.message
    });
  }
});

// ============================================
// LOGIN
// ============================================

app.post('/api/login', async (req, res) => {

  try {

    const { emailOrName, password } = req.body;

    const user = await User.findOne({
      $or: [
        { email: emailOrName },
        { name: emailOrName }
      ]
    });

    if (!user) {
      return res.status(401).json({
        error: 'User not found'
      });
    }

    if (user.password !== password) {
      return res.status(401).json({
        error: 'Wrong password'
      });
    }

    res.json({
      success: true,
      user
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: err.message
    });
  }

});

// ============================================
// TEST API
// ============================================

app.get('/api/test', (req, res) => {

  res.json({
    message: 'Backend is working!',
    timestamp: new Date().toISOString(),
    status: 'online'
  });

});

// ============================================
// WHATSAPP SHARE LINK
// ============================================

app.post('/api/send-whatsapp-link', async (req, res) => {

  const {
    friendName,
    friendNumber,
    dressName,
    dressLink
  } = req.body;

  const whatsappLink =
    `https://wa.me/${friendNumber}?text=${encodeURIComponent(
      `👗 ${dressName} has been added for voting!\nVote here: ${dressLink}`
    )}`;

  res.json({
    success: true,
    whatsappLink
  });

});

// ============================================
// EMAILJS CONTACT FORM
// ============================================

const EMAILJS_SERVICE_ID = process.env.EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = process.env.EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY;

app.post('/api/send-contact-email', async (req, res) => {

  const {
    name,
    email,
    subject,
    message
  } = req.body;

  try {

    const response = await axios.post(
      'https://api.emailjs.com/api/v1.0/email/send',
      {
        service_id: EMAILJS_SERVICE_ID,
        template_id: EMAILJS_TEMPLATE_ID,
        user_id: EMAILJS_PUBLIC_KEY,

        template_params: {
          name,
          email,
          subject: subject || 'No subject',
          message
        }
      }
    );

    res.json({
      success: true,
      data: response.data
    });

  } catch (error) {

    console.error(
      'EmailJS error:',
      error.response?.data || error.message
    );

    res.status(500).json({
      error: 'Failed to send email'
    });

  }

});

// ============================================
// START SERVER
// ============================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

  console.log(`🚀 Backend running on port ${PORT}`);

  console.log(
    `✅ Test API: http://localhost:${PORT}/api/test`
  );

});