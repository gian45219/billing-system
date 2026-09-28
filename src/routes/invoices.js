const express = require('express');
const router = express.Router();
const Invoice = require('../models/Invoice');

// Get invoices by customer
router.get('/customer/:customer_id', async (req, res) => {
  try {
    const { limit = 10, offset = 0 } = req.query;
    const invoices = await Invoice.findByCustomerId(
      req.params.customer_id,
      parseInt(limit),
      parseInt(offset)
    );
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get invoice by ID
router.get('/:id', async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get invoices by status
router.get('/status/:status', async (req, res) => {
  try {
    const invoices = await Invoice.findByStatus(req.params.status);
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark invoice as paid
router.put('/:id/mark-paid', async (req, res) => {
  try {
    const invoice = await Invoice.update(req.params.id, { status: 'paid' });
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
