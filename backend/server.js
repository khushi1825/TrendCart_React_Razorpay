require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const axios = require('axios');


const productRoutes = require('./routes/product');
const votingRoutes = require('./routes/voting');
const orderRoutes = require('./routes/order');
const authRoutes = require('./routes/auth');
const cartRoutes = require('./routes/cart');
const wishlistRoutes = require('./routes/wishlist');
const friendsRoutes = require('./routes/friends');


//require('dotenv').config();

const app = express();

// ============================================
// MIDDLEWARE
// ============================================

const allowedOrigins = [
  'http://localhost:3000',
  'https://trend-cart-react-razorpay-m5wq.vercel.app'
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests without an origin
      // (Postman, server-to-server, etc.)
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error('Not allowed by CORS')
      );
    },
    credentials: true
  })
);

app.use(express.json());

app.use(cookieParser());

// ============================================
// PRODUCT ROUTES
// ============================================

app.use('/api/products', productRoutes);
app.use('/api/voting', votingRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/friends', friendsRoutes);


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

;

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