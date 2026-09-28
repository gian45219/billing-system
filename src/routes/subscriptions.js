const express = require('express');
const router = express.Router();
const Subscription = require('../models/Subscription');
const Plan = require('../models/Plan');
const Customer = require('../models/Customer');
const stripe = require('../config/stripe');

// Create subscription
router.post('/', async (req, res) => {
  try {
    const { customer_id, plan_id } = req.body;

    // Get customer and plan
    const customer = await Customer.findById(customer_id);
    const plan = await Plan.findById(plan_id);

    if (!customer || !plan) {
      return res.status(404).json({ error: 'Customer or Plan not found' });
    }

    // Create Stripe subscription
    const stripeSubscription = await stripe.subscriptions.create({
      customer: customer.stripe_customer_id,
      items: [
        {
          price: plan.stripe_price_id
        }
      ]
    });

    // Create database subscription
    const subscription = await Subscription.create({
      customer_id,
      plan_id,
      stripe_subscription_id: stripeSubscription.id,
      status: stripeSubscription.status,
      current_period_start: new Date(stripeSubscription.current_period_start * 1000),
      current_period_end: new Date(stripeSubscription.current_period_end * 1000)
    });

    res.status(201).json(subscription);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get subscriptions by customer
router.get('/customer/:customer_id', async (req, res) => {
  try {
    const subscriptions = await Subscription.findByCustomerId(req.params.customer_id);
    res.json(subscriptions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get subscription by ID
router.get('/:id', async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }
    res.json(subscription);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Cancel subscription
router.post('/:id/cancel', async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    // Cancel Stripe subscription
    await stripe.subscriptions.del(subscription.stripe_subscription_id);

    // Update database subscription
    const updated = await Subscription.cancel(req.params.id);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
