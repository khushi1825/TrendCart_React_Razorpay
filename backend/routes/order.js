const express = require('express');

const {
  createOrder,
  verifyPayment
} = require('../controllers/orderController');

const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post(
  '/create',
  authMiddleware,
  createOrder
);

router.post(
  '/verify',
  authMiddleware,
  verifyPayment
);

module.exports = router;