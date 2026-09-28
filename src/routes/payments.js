const express = require('express');
const router = express.Router();
const stripe = require('../config/stripe');

// Create payment intent
router.post('/create-intent', async (req, res) => {
  try {
    const { amount, currency = 'usd', customer_id } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency,
      customer: customer_id
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      intentId: paymentIntent.id
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get payment method
router.get('/:payment_method_id', async (req, res) => {
  try {
    const paymentMethod = await stripe.paymentMethods.retrieve(req.params.payment_method_id);
    res.json(paymentMethod);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
