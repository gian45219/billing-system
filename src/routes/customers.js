const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');
const stripe = require('../config/stripe');

// Create customer
router.post('/', async (req, res) => {
  try {
    const { email, name, company } = req.body;

    // Create Stripe customer
    const stripeCustomer = await stripe.customers.create({
      email,
      name,
      metadata: { company }
    });

    // Create database customer
    const customer = await Customer.create({
      email,
      name,
      company,
      stripe_customer_id: stripeCustomer.id
    });

    res.status(201).json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all customers
router.get('/', async (req, res) => {
  try {
    const { limit = 10, offset = 0 } = req.query;
    const customers = await Customer.findAll(parseInt(limit), parseInt(offset));
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get customer by ID
router.get('/:id', async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update customer
router.put('/:id', async (req, res) => {
  try {
    const { email, name, company } = req.body;
    const customer = await Customer.update(req.params.id, { email, name, company });
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete customer
router.delete('/:id', async (req, res) => {
  try {
    const customer = await Customer.delete(req.params.id);
    res.json({ message: 'Customer deleted', customer });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
