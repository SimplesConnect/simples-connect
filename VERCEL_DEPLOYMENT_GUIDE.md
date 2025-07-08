# 🚀 Vercel Deployment Guide for Simples Connect

This guide will walk you through deploying both the frontend and backend of Simples Connect to Vercel.

## 📋 Prerequisites

- [x] Vercel account created
- [x] GitHub repository with your code
- [x] Stripe live keys configured
- [x] Supabase database setup
- [x] Domain name (optional but recommended)

## 🎯 Deployment Strategy

We'll deploy:
1. **Frontend** → Main domain (e.g., `simplesconnect.com`)
2. **Backend** → Subdomain (e.g., `api.simplesconnect.com`)

## 🔧 Step 1: Prepare for Deployment

### 1.1 Update Environment Variables

Create these environment files:

**Backend `.env` (for production):**
```env
# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key

# Stripe Live Configuration
STRIPE_SECRET_KEY=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
STRIPE_PUBLISHABLE_KEY=pk_live_51RhtlME7HDHqiOXj2h2S8oYKkNa5AYPCOI4U7JIfjlfvaINJEdkqB0xRJygGdBIvQMRmOB1D9TpO9031NFpGfnWh00kfqlpYvc
STRIPE_WEBHOOK_SECRET=whsec_your_production_webhook_secret

# Live Price IDs
STRIPE_COMMUNITY_MONTHLY_PRICE=price_1RiSAoE7HDHqiOXjvl5goLnz
STRIPE_COMMUNITY_YEARLY_PRICE=price_1RiSAoE7HDHqiOXjP6aWkmu5
STRIPE_PREMIUM_MONTHLY_PRICE=price_1RiSApE7HDHqiOXj5HaYenvL
STRIPE_PREMIUM_YEARLY_PRICE=price_1RiSApE7HDHqiOXjdyvpC6mR
STRIPE_VIP_MONTHLY_PRICE=price_1RiSAqE7HDHqiOXjIb7a3VN1
STRIPE_VIP_YEARLY_PRICE=price_1RiSAqE7HDHqiOXjLVg7UNBo

# Promo Codes
STRIPE_LAUNCH_PROMO=LAUNCH50

# Application Configuration
JWT_SECRET=your_production_jwt_secret_here
NODE_ENV=production
DOMAIN=https://yourdomain.com
```

### 1.2 Commit Changes to GitHub

```bash
git add .
git commit -m "Configure for Vercel deployment"
git push origin main
```

## 🌐 Step 2: Deploy Backend

### 2.1 Create Backend Deployment

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"New Project"**
3. Import your GitHub repository
4. Select the **backend** folder as the root directory
5. Configure the project:
   - **Framework Preset**: Other
   - **Root Directory**: backend
   - **Build Command**: `npm install`
   - **Output Directory**: (leave empty)

### 2.2 Configure Backend Environment Variables

In Vercel dashboard for your backend project:

1. Go to **Settings** → **Environment Variables**
2. Add all the environment variables from your `.env` file
3. Make sure to set `NODE_ENV=production`

### 2.3 Deploy Backend

1. Click **Deploy**
2. Wait for deployment to complete
3. Note your backend URL (e.g., `https://simples-connect-backend.vercel.app`)

## 🎨 Step 3: Deploy Frontend

### 3.1 Update Frontend Configuration

Update `frontend/vercel.json` with your actual backend URL:

```json
{
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "https://YOUR-BACKEND-URL.vercel.app/api/$1"
    }
  ],
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "https://YOUR-BACKEND-URL.vercel.app/api/$1"
    }
  ]
}
```

### 3.2 Create Frontend Deployment

1. In Vercel Dashboard, click **"New Project"** again
2. Import the same GitHub repository
3. Select the **frontend** folder as the root directory
4. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: frontend
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 3.3 Configure Frontend Environment Variables

Add these environment variables:
- `NODE_ENV=production`
- `VITE_API_URL=https://YOUR-BACKEND-URL.vercel.app`

### 3.4 Deploy Frontend

1. Click **Deploy**
2. Wait for deployment to complete
3. Your app is now live!

## 🔗 Step 4: Set Up Custom Domain (Optional)

### 4.1 Configure Custom Domain

1. In your frontend project settings
2. Go to **Domains**
3. Add your custom domain (e.g., `simplesconnect.com`)
4. Follow Vercel's DNS configuration instructions

### 4.2 Update Backend Domain

1. In your backend project settings
2. Add a subdomain (e.g., `api.simplesconnect.com`)
3. Update frontend `vercel.json` to use the custom API domain

## 🎣 Step 5: Configure Stripe Webhooks

### 5.1 Create Production Webhook

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Developers** → **Webhooks**
3. Click **"Add endpoint"**
4. Set URL to: `https://YOUR-BACKEND-URL.vercel.app/api/subscription/webhook`
5. Select these events:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
   - `invoice.payment_succeeded`

### 5.2 Update Webhook Secret

1. Copy the webhook signing secret from Stripe
2. Update `STRIPE_WEBHOOK_SECRET` in your Vercel backend environment variables
3. Redeploy the backend

## 🧪 Step 6: Test Production Deployment

### 6.1 Test Core Functionality

1. Visit your deployed frontend
2. Test user registration/login
3. Complete profile setup
4. Test matching system
5. Test messaging
6. **Test subscription flow with real payment**

### 6.2 Test Stripe Integration

1. Go to subscription page
2. Select a plan
3. Use test card: `4242 4242 4242 4242`
4. Complete checkout
5. Verify subscription is active
6. Test webhook delivery in Stripe dashboard

## 📊 Step 7: Monitor and Optimize

### 7.1 Set Up Monitoring

- Check Vercel Analytics
- Monitor Stripe Dashboard
- Set up error tracking (Sentry, LogRocket)

### 7.2 Performance Optimization

- Enable Vercel's Edge Network
- Optimize images and assets
- Set up proper caching headers

## 🔒 Security Checklist

- [x] All API keys are in environment variables
- [x] JWT secrets are secure and different from development
- [x] CORS is properly configured
- [x] Stripe webhook signatures are verified
- [x] Database RLS policies are enabled
- [x] HTTPS is enforced

## 🎉 Deployment Complete!

Your Simples Connect dating app is now live on Vercel with:

- ✅ Frontend deployed and optimized
- ✅ Backend running on serverless functions
- ✅ Live Stripe payments configured
- ✅ Production webhooks working
- ✅ Custom domain (if configured)
- ✅ SSL/HTTPS enabled

## 🆘 Troubleshooting

### Common Issues

**1. API calls failing:**
- Check Vercel function logs
- Verify environment variables
- Check CORS configuration

**2. Stripe webhooks not working:**
- Verify webhook URL is correct
- Check webhook secret in environment variables
- Test webhook delivery in Stripe dashboard

**3. Database connection issues:**
- Verify Supabase URLs and keys
- Check RLS policies
- Test database connectivity

**4. Build failures:**
- Check Node.js version compatibility
- Verify all dependencies are in package.json
- Check build logs for specific errors

## 📞 Support Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Stripe Webhooks Guide](https://stripe.com/docs/webhooks)
- [Supabase Docs](https://supabase.com/docs)

---

**Congratulations! 🎊 Simples Connect is now live and ready for users!** 