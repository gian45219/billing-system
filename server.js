const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const pool = require('./src/config/database');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/customers', require('./src/routes/customers'));
app.use('/api/plans', require('./src/routes/plans'));
app.use('/api/subscriptions', require('./src/routes/subscriptions'));
app.use('/api/invoices', require('./src/routes/invoices'));
app.use('/api/payments', require('./src/routes/payments'));
app.use('/api/webhooks', require('./src/routes/webhooks'));
app.use('/api/auth', require('./src/routes/auth'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    status: err.status || 500
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 SaaS Billing System running on port ${PORT}`);
});

module.exports = app;
