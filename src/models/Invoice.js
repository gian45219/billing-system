const pool = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class Invoice {
  static async create(data) {
    const { customer_id, subscription_id, amount, currency, status, stripe_invoice_id, due_date } = data;
    const id = uuidv4();
    const created_at = new Date();
    const invoice_number = `INV-${Date.now()}`;

    const result = await pool.query(
      `INSERT INTO invoices (id, invoice_number, customer_id, subscription_id, amount, currency, status, stripe_invoice_id, due_date, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $10)
       RETURNING *`,
      [id, invoice_number, customer_id, subscription_id, amount, currency, status, stripe_invoice_id, due_date, created_at]
    );

    return result.rows[0];
  }

  static async findById(id) {
    const result = await pool.query('SELECT * FROM invoices WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async findByCustomerId(customer_id, limit = 10, offset = 0) {
    const result = await pool.query(
      'SELECT * FROM invoices WHERE customer_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3',
      [customer_id, limit, offset]
    );
    return result.rows;
  }

  static async findByStatus(status) {
    const result = await pool.query(
      'SELECT * FROM invoices WHERE status = $1 ORDER BY created_at DESC',
      [status]
    );
    return result.rows;
  }

  static async update(id, data) {
    const { status } = data;
    const updated_at = new Date();

    const result = await pool.query(
      `UPDATE invoices SET status = $1, updated_at = $2 WHERE id = $3 RETURNING *`,
      [status, updated_at, id]
    );

    return result.rows[0];
  }
}

module.exports = Invoice;
