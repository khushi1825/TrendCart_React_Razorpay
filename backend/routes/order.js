const express = require('express');

const router = express.Router();

const {
  createOrder,
  verifyPayment,
  getMyOrders
} = require('../controllers/orderController');

const authMiddleware = require('../middleware/authMiddleware');

// =====================================================
// CREATE RAZORPAY ORDER
// =====================================================

router.post(
  '/create',
  authMiddleware,
  createOrder
);

// =====================================================
// VERIFY RAZORPAY PAYMENT
// =====================================================

router.post(
  '/verify',
  authMiddleware,
  verifyPayment
);

// =====================================================
// GET LOGGED-IN USER ORDERS
// =====================================================

router.get(
  '/my-orders',
  authMiddleware,
  getMyOrders
);

module.exports = router;