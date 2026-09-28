const express = require('express');
const router = express.Router();
const Plan = require('../models/Plan');
const stripe = require('../config/stripe');

// Create plan
router.post('/', async (req, res) => {
  try {
    const { name, description, price, currency, interval, features } = req.body;

    // Create Stripe product and price
    const product = await stripe.products.create({
      name,
      description
    });

    const stripePrice = await stripe.prices.create({
      product: product.id,
      unit_amount: Math.round(price * 100),
      currency,
      recurring: { interval }
    });

    // Create database plan
    const plan = await Plan.create({
      name,
      description,
      price,
      currency,
      interval,
      features,
      stripe_product_id: product.id,
      stripe_price_id: stripePrice.id
    });

    res.status(201).json(plan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all plans
router.get('/', async (req, res) => {
  try {
    const plans = await Plan.findAll();
    res.json(plans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get plan by ID
router.get('/:id', async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);
    if (!plan) {
      return res.status(404).json({ error: 'Plan not found' });
    }
    res.json(plan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update plan
router.put('/:id', async (req, res) => {
  try {
    const { name, description, price, features } = req.body;
    const plan = await Plan.update(req.params.id, { name, description, price, features });
    res.json(plan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete plan
router.delete('/:id', async (req, res) => {
  try {
    const plan = await Plan.delete(req.params.id);
    res.json({ message: 'Plan deleted', plan });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
