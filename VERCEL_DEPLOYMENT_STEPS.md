# 🚀 Vercel Deployment Steps - Follow Along

## Step 1: Login to Vercel

You should see a login prompt in your terminal. Please:

1. **Select "Continue with GitHub"** (recommended)
2. This will open your browser to authenticate with Vercel
3. Grant permissions to your GitHub account
4. Return to the terminal once authentication is complete

## Step 2: Deploy Backend

After logging in, continue with the backend deployment:

1. **Project Setup**: 
   - When asked "Set up and deploy?", select **Yes**
   - Project name: `simples-connect-backend`
   - Directory: Should detect `backend` automatically
   - Framework: Select **"Other"**

2. **Configuration**:
   - Build Command: Leave empty (default: `npm install`)
   - Output Directory: Leave empty
   - Development Command: Leave empty

3. **Environment Variables** (Critical!):
   After deployment, you'll need to add these environment variables in the Vercel dashboard:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key
STRIPE_SECRET_KEY=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
STRIPE_PUBLISHABLE_KEY=pk_live_51RhtlME7HDHqiOXj2h2S8oYKkNa5AYPCOI4U7JIfjlfvaINJEdkqB0xRJygGdBIvQMRmOB1D9TpO9031NFpGfnWh00kfqlpYvc
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
STRIPE_COMMUNITY_MONTHLY_PRICE=price_1RiSAoE7HDHqiOXjvl5goLnz
STRIPE_COMMUNITY_YEARLY_PRICE=price_1RiSAoE7HDHqiOXjP6aWkmu5
STRIPE_PREMIUM_MONTHLY_PRICE=price_1RiSApE7HDHqiOXj5HaYenvL
STRIPE_PREMIUM_YEARLY_PRICE=price_1RiSApE7HDHqiOXjdyvpC6mR
STRIPE_VIP_MONTHLY_PRICE=price_1RiSAqE7HDHqiOXjIb7a3VN1
STRIPE_VIP_YEARLY_PRICE=price_1RiSAqE7HDHqiOXjLVg7UNBo
STRIPE_LAUNCH_PROMO=LAUNCH50
JWT_SECRET=your_secure_jwt_secret_here
NODE_ENV=production
```

## Step 3: Get Backend URL

After successful backend deployment, note the URL. It will be something like:
`https://simples-connect-backend-xxx.vercel.app`

## Step 4: Deploy Frontend

1. Navigate back to the project root:
   ```bash
   cd ..
   cd frontend
   ```

2. Run Vercel deployment:
   ```bash
   vercel
   ```

3. **Frontend Configuration**:
   - Project name: `simples-connect-frontend`
   - Framework: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Development Command: `npm run dev`

## Step 5: Update Frontend Configuration

Before deploying frontend, update the `frontend/vercel.json` file with your actual backend URL:

```json
{
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "https://YOUR-ACTUAL-BACKEND-URL.vercel.app/api/$1"
    }
  ],
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "https://YOUR-ACTUAL-BACKEND-URL.vercel.app/api/$1"
    }
  ]
}
```

## Step 6: Add Environment Variables in Vercel Dashboard

### For Backend Project:
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on your backend project
3. Go to **Settings** → **Environment Variables**
4. Add all the environment variables listed above

### For Frontend Project:
1. Click on your frontend project
2. Add these environment variables:
   - `NODE_ENV=production`
   - `VITE_STRIPE_PUBLISHABLE_KEY=pk_live_51RhtlME7HDHqiOXj2h2S8oYKkNa5AYPCOI4U7JIfjlfvaINJEdkqB0xRJygGdBIvQMRmOB1D9TpO9031NFpGfnWh00kfqlpYvc`

## Step 7: Configure Stripe Webhooks

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Developers** → **Webhooks**
3. Click **"Add endpoint"**
4. **Endpoint URL**: `https://YOUR-BACKEND-URL.vercel.app/api/subscription/webhook`
5. **Events to send**:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
   - `invoice.payment_succeeded`
6. **Copy the webhook signing secret** and add it to your backend environment variables as `STRIPE_WEBHOOK_SECRET`

## Step 8: Redeploy with Environment Variables

After adding environment variables:

1. **Redeploy Backend**:
   ```bash
   cd backend
   vercel --prod
   ```

2. **Redeploy Frontend**:
   ```bash
   cd ../frontend
   vercel --prod
   ```

## Step 9: Test Your Live Application

### Test Authentication:
1. Visit your frontend URL
2. Try to register a new account
3. Complete profile setup

### Test Subscription Flow:
1. Go to subscription page
2. Select a plan (try Premium)
3. Use Stripe test card: `4242 4242 4242 4242`
4. Complete checkout
5. Verify subscription is active

### Test Webhook Delivery:
1. Check Stripe Dashboard → Webhooks
2. Look for successful webhook deliveries
3. Check your Vercel function logs for webhook processing

## 🎉 Deployment Complete!

Your URLs will be:
- **Frontend**: `https://simples-connect-frontend-xxx.vercel.app`
- **Backend**: `https://simples-connect-backend-xxx.vercel.app`

## 🚨 Important Notes

1. **Replace placeholder URLs** in your configurations with actual Vercel URLs
2. **Test thoroughly** before announcing launch
3. **Set up custom domains** for a professional look
4. **Monitor function usage** in Vercel dashboard
5. **Check Stripe webhook delivery** regularly

## Next Steps After Deployment

1. **Custom Domain**: Set up `simplesconnect.com` and `api.simplesconnect.com`
2. **Analytics**: Enable Vercel Analytics
3. **Monitoring**: Set up error tracking
4. **SEO**: Add meta tags and sitemap
5. **Performance**: Optimize images and loading

---

**Let me know when you complete each step and I'll help troubleshoot any issues!**