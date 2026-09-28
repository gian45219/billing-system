const pool = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class Subscription {
  static async create(data) {
    const { customer_id, plan_id, stripe_subscription_id, status, current_period_start, current_period_end } = data;
    const id = uuidv4();
    const created_at = new Date();

    const result = await pool.query(
      `INSERT INTO subscriptions (id, customer_id, plan_id, stripe_subscription_id, status, current_period_start, current_period_end, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $8)
       RETURNING *`,
      [id, customer_id, plan_id, stripe_subscription_id, status, current_period_start, current_period_end, created_at]
    );

    return result.rows[0];
  }

  static async findById(id) {
    const result = await pool.query('SELECT * FROM subscriptions WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async findByCustomerId(customer_id) {
    const result = await pool.query(
      'SELECT * FROM subscriptions WHERE customer_id = $1 ORDER BY created_at DESC',
      [customer_id]
    );
    return result.rows;
  }

  static async findByStripeId(stripe_subscription_id) {
    const result = await pool.query(
      'SELECT * FROM subscriptions WHERE stripe_subscription_id = $1',
      [stripe_subscription_id]
    );
    return result.rows[0];
  }

  static async update(id, data) {
    const { status, current_period_start, current_period_end } = data;
    const updated_at = new Date();

    const result = await pool.query(
      `UPDATE subscriptions SET status = $1, current_period_start = $2, current_period_end = $3, updated_at = $4
       WHERE id = $5 RETURNING *`,
      [status, current_period_start, current_period_end, updated_at, id]
    );

    return result.rows[0];
  }

  static async cancel(id) {
    const updated_at = new Date();
    const result = await pool.query(
      `UPDATE subscriptions SET status = 'canceled', updated_at = $1 WHERE id = $2 RETURNING *`,
      [updated_at, id]
    );
    return result.rows[0];
  }
}

module.exports = Subscription;
