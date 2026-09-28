# SaaS Billing System

A comprehensive billing system built with Node.js, Express, PostgreSQL, and Stripe integration.

## Features

- **Customer Management**: Create and manage customers with Stripe integration
- **Plans & Pricing**: Define flexible pricing plans with different intervals
- **Subscriptions**: Manage recurring subscriptions with automatic billing
- **Invoices**: Automatic invoice generation and tracking
- **Payment Processing**: Stripe integration for secure payments
- **Webhooks**: Handle Stripe events for real-time updates

## Tech Stack

- **Backend**: Node.js + Express
- **Database**: PostgreSQL
- **Payments**: Stripe API
- **Authentication**: JWT

## Setup

### Prerequisites

- Node.js (v14+)
- PostgreSQL
- Stripe Account

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/billing-system.git
cd billing-system
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Create database tables
```bash
npm run migrate
```

5. Start the server
```bash
npm run dev
```

## API Endpoints

### Customers
- `POST /api/customers` - Create customer
- `GET /api/customers` - List customers
- `GET /api/customers/:id` - Get customer
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

### Plans
- `POST /api/plans` - Create plan
- `GET /api/plans` - List plans
- `GET /api/plans/:id` - Get plan
- `PUT /api/plans/:id` - Update plan
- `DELETE /api/plans/:id` - Delete plan

### Subscriptions
- `POST /api/subscriptions` - Create subscription
- `GET /api/subscriptions/:id` - Get subscription
- `GET /api/subscriptions/customer/:customer_id` - Get customer subscriptions
- `POST /api/subscriptions/:id/cancel` - Cancel subscription

### Invoices
- `GET /api/invoices/:id` - Get invoice
- `GET /api/invoices/customer/:customer_id` - Get customer invoices
- `GET /api/invoices/status/:status` - Get invoices by status
- `PUT /api/invoices/:id/mark-paid` - Mark invoice as paid

### Payments
- `POST /api/payments/create-intent` - Create payment intent
- `GET /api/payments/:payment_method_id` - Get payment method

## Webhooks

Configure Stripe webhooks to point to `POST /api/webhooks/stripe`. The system handles:
- Subscription updates
- Invoice payment succeeded
- Invoice payment failed

## Project Structure

```
src/
├── config/
│   ├── database.js
│   └── stripe.js
├── models/
│   ├── Customer.js
│   ├── Plan.js
│   ├── Subscription.js
│   └── Invoice.js
├── routes/
│   ├── customers.js
│   ├── plans.js
│   ├── subscriptions.js
│   ├── invoices.js
│   ├── payments.js
│   ├── webhooks.js
│   └── auth.js
scripts/
├── migrate.js
server.js
```

## Next Steps

1. Implement user authentication
2. Add usage-based billing
3. Implement dunning (retry failed payments)
4. Add tax calculation
5. Create admin dashboard frontend
6. Add email notifications
7. Implement audit logging

## License

MIT
