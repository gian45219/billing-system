const pool = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class Plan {
  static async create(data) {
    const { name, description, price, currency, interval, features, stripe_product_id, stripe_price_id } = data;
    const id = uuidv4();
    const created_at = new Date();

    const result = await pool.query(
      `INSERT INTO plans (id, name, description, price, currency, interval, features, stripe_product_id, stripe_price_id, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $10)
       RETURNING *`,
      [id, name, description, price, currency, interval, JSON.stringify(features), stripe_product_id, stripe_price_id, created_at]
    );

    return result.rows[0];
  }

  static async findById(id) {
    const result = await pool.query('SELECT * FROM plans WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async findAll() {
    const result = await pool.query('SELECT * FROM plans ORDER BY price ASC');
    return result.rows;
  }

  static async update(id, data) {
    const { name, description, price, features } = data;
    const updated_at = new Date();

    const result = await pool.query(
      `UPDATE plans SET name = $1, description = $2, price = $3, features = $4, updated_at = $5
       WHERE id = $6 RETURNING *`,
      [name, description, price, JSON.stringify(features), updated_at, id]
    );

    return result.rows[0];
  }

  static async delete(id) {
    const result = await pool.query('DELETE FROM plans WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  }
}

module.exports = Plan;
