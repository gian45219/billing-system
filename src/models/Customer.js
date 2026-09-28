const pool = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class Customer {
  static async create(data) {
    const { email, name, company, stripe_customer_id } = data;
    const id = uuidv4();
    const created_at = new Date();

    const result = await pool.query(
      `INSERT INTO customers (id, email, name, company, stripe_customer_id, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $6)
       RETURNING *`,
      [id, email, name, company, stripe_customer_id, created_at]
    );

    return result.rows[0];
  }

  static async findById(id) {
    const result = await pool.query('SELECT * FROM customers WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async findByEmail(email) {
    const result = await pool.query('SELECT * FROM customers WHERE email = $1', [email]);
    return result.rows[0];
  }

  static async findByStripeId(stripe_customer_id) {
    const result = await pool.query(
      'SELECT * FROM customers WHERE stripe_customer_id = $1',
      [stripe_customer_id]
    );
    return result.rows[0];
  }

  static async update(id, data) {
    const { email, name, company } = data;
    const updated_at = new Date();

    const result = await pool.query(
      `UPDATE customers SET email = $1, name = $2, company = $3, updated_at = $4
       WHERE id = $5 RETURNING *`,
      [email, name, company, updated_at, id]
    );

    return result.rows[0];
  }

  static async delete(id) {
    const result = await pool.query('DELETE FROM customers WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  }

  static async findAll(limit = 10, offset = 0) {
    const result = await pool.query(
      'SELECT * FROM customers ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );
    return result.rows;
  }
}

module.exports = Customer;
