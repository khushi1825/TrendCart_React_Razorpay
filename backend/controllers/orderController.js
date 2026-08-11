const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// CREATE RAZORPAY ORDER
const createOrder = async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        error: 'Cart is empty'
      });
    }

    // Calculate total on backend
    const totalAmount = items.reduce(
      (sum, item) =>
        sum + Number(item.price) * Number(item.quantity),
      0
    );

    if (totalAmount <= 0) {
      return res.status(400).json({
        error: 'Invalid order amount'
      });
    }

    // Razorpay uses paise
    const amountInPaise = Math.round(totalAmount * 100);

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`
    });

    // Save pending order in MongoDB
    const order = await Order.create({
      user: req.userId,

      items: items.map(item => ({
        product: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      })),

      totalAmount,

      currency: 'INR',

      status: 'pending',

      paymentStatus: 'pending',

      razorpayOrderId: razorpayOrder.id
    });

    res.status(201).json({
      success: true,
      orderId: order._id,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_KEY_ID
    });

  } catch (error) {
    console.error(
      'Create Razorpay order error:',
      error
    );

    res.status(500).json({
      error: 'Failed to create payment order'
    });
  }
};


// VERIFY PAYMENT
const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature
    } = req.body;

    if (
      !razorpay_payment_id ||
      !razorpay_order_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        error: 'Missing payment details'
      });
    }

    const order = await Order.findOne({
      razorpayOrderId: razorpay_order_id,
      user: req.userId
    });

    if (!order) {
      return res.status(404).json({
        error: 'Order not found'
      });
    }

    const generatedSignature =
      crypto
        .createHmac(
          'sha256',
          process.env.RAZORPAY_KEY_SECRET
        )
        .update(
          `${order.razorpayOrderId}|${razorpay_payment_id}`
        )
        .digest('hex');

    const isValid =
      generatedSignature === razorpay_signature;

    if (!isValid) {
      order.paymentStatus = 'failed';
      await order.save();

      return res.status(400).json({
        error: 'Payment verification failed'
      });
    }

    order.razorpayPaymentId =
      razorpay_payment_id;

    order.razorpaySignature =
      razorpay_signature;

    order.paymentStatus = 'paid';

    order.status = 'confirmed';

    await order.save();

    res.json({
      success: true,
      message: 'Payment verified successfully',
      order
    });

  } catch (error) {
    console.error(
      'Payment verification error:',
      error
    );

    res.status(500).json({
      error: 'Payment verification failed'
    });
  }
};


module.exports = {
  createOrder,
  verifyPayment
};