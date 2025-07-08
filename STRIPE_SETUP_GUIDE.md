# 🚀 Stripe Subscription System Setup Guide

This guide will help you implement the complete subscription system with Stripe integration for Simples Connect.

## 📋 Prerequisites

- [x] Stripe account created for "Simples Dating"
- [x] Node.js backend with Express
- [x] Supabase database
- [x] React frontend

## 🔧 Step 1: Get Your Stripe Keys

### 1.1 Find Your Test Secret Key
1. Log in to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Click **"Developers"** in the left sidebar
3. Click **"API keys"**
4. Under "Standard keys", click **"Reveal test key"** for the Secret key
5. Copy the key that starts with `sk_test_...`

### 1.2 Get Your Publishable Key
- Also copy the Publishable key that starts with `pk_test_...`

## 🗄️ Step 2: Database Setup

### 2.1 Run the Database Migration
Execute the SQL script to add subscription fields to your Supabase database:

```bash
# In your Supabase SQL editor, run:
psql -f backend/add_subscription_fields.sql
```

Or copy and paste the contents of `backend/add_subscription_fields.sql` into your Supabase SQL editor.

## ⚙️ Step 3: Backend Configuration

### 3.1 Environment Variables
Add these to your `backend/.env` file:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=
DOMAIN=http://localhost:5173

# These will be generated in Step 4
STRIPE_COMMUNITY_MONTHLY_PRICE=
STRIPE_COMMUNITY_YEARLY_PRICE=
STRIPE_PREMIUM_MONTHLY_PRICE=
STRIPE_PREMIUM_YEARLY_PRICE=
STRIPE_VIP_MONTHLY_PRICE=
STRIPE_VIP_YEARLY_PRICE=
```

### 3.2 Install Dependencies
```bash
cd backend
npm install stripe
```

## 🛍️ Step 4: Create Stripe Products

### 4.1 Run the Product Creation Script
```bash
cd backend
node scripts/create_stripe_products.js
```

### 4.2 Update Environment Variables
The script will output price IDs like this:
```
STRIPE_COMMUNITY_MONTHLY_PRICE=price_1ABC123...
STRIPE_COMMUNITY_YEARLY_PRICE=price_1DEF456...
# ... etc
```

Copy these to your `.env` file.

## 🔗 Step 5: Setup Webhooks (Production)

### 5.1 Create Webhook Endpoint
1. In Stripe Dashboard, go to **"Developers" > "Webhooks"**
2. Click **"Add endpoint"**
3. URL: `https://your-domain.com/api/subscription/webhook`
4. Select these events:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
   - `invoice.payment_succeeded`

### 5.2 Get Webhook Secret
1. Click on your created webhook
2. Copy the **"Signing secret"** (starts with `whsec_...`)
3. Add to your `.env` as `STRIPE_WEBHOOK_SECRET`

## 🚀 Step 6: Start Your Servers

### 6.1 Backend
```bash
cd backend
npm run dev
```

### 6.2 Frontend
```bash
cd frontend
npm run dev
```

## 🧪 Step 7: Test the System

### 7.1 Test Subscription Flow
1. Go to `http://localhost:5173/subscription`
2. Select a plan
3. Use Stripe test card: `4242 4242 4242 4242`
4. Complete checkout
5. Verify user is upgraded in dashboard

### 7.2 Test Webhooks (Local Development)
For local testing, use Stripe CLI:
```bash
# Install Stripe CLI
# Then forward webhooks to local server
stripe listen --forward-to localhost:5000/api/subscription/webhook
```

## 📊 Step 8: Verify Everything Works

### 8.1 Check Database
Verify subscription data is being saved:
```sql
SELECT id, subscription_tier, subscription_expiry, trial_ends_at 
FROM profiles 
WHERE subscription_tier != 'free';
```

### 8.2 Test Features
- **Trial Status**: Check dashboard shows trial info
- **Subscription Limits**: Test swipe limits for community tier
- **Billing Portal**: Test "Manage Subscription" button
- **Upgrades/Downgrades**: Test tier changes

## 🎯 Step 9: Production Deployment

### 9.1 Switch to Live Keys
1. In Stripe Dashboard, toggle to **"Live"** mode
2. Get live secret key (`sk_live_...`)
3. Update production `.env` with live keys
4. Re-run product creation script with live keys

### 9.2 Update Webhook URL
Update webhook endpoint to your production domain.

## 🔒 Security Checklist

- [x] Never commit `.env` files to Git
- [x] Use environment variables for all secrets
- [x] Verify webhook signatures
- [x] Use HTTPS in production
- [x] Validate user permissions on all endpoints

## 🐛 Troubleshooting

### Common Issues

**1. "No such price" error**
- Verify price IDs in `.env` match Stripe dashboard
- Ensure you're using test keys with test prices

**2. Webhook signature verification failed**
- Check `STRIPE_WEBHOOK_SECRET` is correct
- Ensure raw body is passed to webhook handler

**3. Subscription not updating in database**
- Check webhook endpoint is reachable
- Verify webhook events are being received
- Check server logs for errors

**4. Trial not working**
- Verify `trial_ends_at` is set correctly in database
- Check subscription status API response

## 📞 Support

If you encounter issues:
1. Check the browser console for errors
2. Check backend server logs
3. Check Stripe Dashboard > Events for webhook delivery
4. Verify database has correct subscription data

## 🎉 Success!

Once everything is working, you'll have:
- ✅ 30-day free trials for all users
- ✅ Three subscription tiers with different features
- ✅ Stripe payment processing
- ✅ Automatic subscription management
- ✅ Usage limits and feature gating
- ✅ Founding member special treatment
- ✅ Promo code support

Your MVP subscription system is now ready for your soft launch! 🚀 