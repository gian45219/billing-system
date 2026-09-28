const express = require('express');
const router = express.Router();
const stripe = require('../config/stripe');
const Subscription = require('../models/Subscription');
const Invoice = require('../models/Invoice');

// Handle Stripe webhooks
router.post('/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    switch (event.type) {
      case 'customer.subscription.updated':
        const subscriptionUpdated = event.data.object;
        const subUpdated = await Subscription.findByStripeId(subscriptionUpdated.id);
        if (subUpdated) {
          await Subscription.update(subUpdated.id, {
            status: subscriptionUpdated.status,
            current_period_start: new Date(subscriptionUpdated.current_period_start * 1000),
            current_period_end: new Date(subscriptionUpdated.current_period_end * 1000)
          });
        }
        break;

      case 'invoice.payment_succeeded':
        const invoicePaid = event.data.object;
        console.log(`Invoice ${invoicePaid.id} paid`);
        break;

      case 'invoice.payment_failed':
        const invoiceFailed = event.data.object;
        console.log(`Invoice ${invoiceFailed.id} payment failed`);
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
});

module.exports = router;
