const pool = require('../src/config/database');

const createTables = async () => {
  try {
    console.log('Creating database tables...');

    // Customers table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS customers (
        id UUID PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255),
        company VARCHAR(255),
        stripe_customer_id VARCHAR(255) UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✓ Customers table created');

    // Plans table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS plans (
        id UUID PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        currency VARCHAR(3) DEFAULT 'usd',
        interval VARCHAR(50),
        features JSONB,
        stripe_product_id VARCHAR(255),
        stripe_price_id VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✓ Plans table created');

    // Subscriptions table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS subscriptions (
        id UUID PRIMARY KEY,
        customer_id UUID NOT NULL REFERENCES customers(id),
        plan_id UUID NOT NULL REFERENCES plans(id),
        stripe_subscription_id VARCHAR(255) UNIQUE,
        status VARCHAR(50),
        current_period_start TIMESTAMP,
        current_period_end TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✓ Subscriptions table created');

    // Invoices table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS invoices (
        id UUID PRIMARY KEY,
        invoice_number VARCHAR(255) UNIQUE,
        customer_id UUID NOT NULL REFERENCES customers(id),
        subscription_id UUID REFERENCES subscriptions(id),
        amount DECIMAL(10, 2) NOT NULL,
        currency VARCHAR(3) DEFAULT 'usd',
        status VARCHAR(50),
        stripe_invoice_id VARCHAR(255),
        due_date TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✓ Invoices table created');

    console.log('\n✅ Database migration complete!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

createUsers();
