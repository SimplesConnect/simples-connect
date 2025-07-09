# Vercel Deployment Setup Guide

## 🚨 Issues Identified

### 1. Google Login Not Working
- **Problem**: Supabase environment variables not configured properly
- **Frontend**: Using placeholder values in `supabase.js`
- **Backend**: Missing Supabase configuration in environment

### 2. Discover Page Errors
- **Problem**: API calls failing due to authentication issues
- **Root Cause**: Supabase client not properly initialized

## 🛠️ Fix Steps

### Step 1: Configure Supabase Environment Variables

#### Frontend (.env file in /frontend/)
```bash
# Create frontend/.env file with:
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
VITE_API_URL=https://simples-connect-backend.vercel.app
VITE_DOMAIN=https://simplesconnect.com
```

#### Backend (.env file in /backend/)
```bash
# Create backend/.env file with:
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_KEY=your_supabase_service_key_here
JWT_SECRET=your_jwt_secret_here
PORT=5000
DOMAIN=https://simplesconnect.com

# Your existing Stripe configuration...
STRIPE_SECRET_KEY=sk_test_51RhtlSCZ786xVLD8cRnkUaHzYFK1Rdhzc3FNBHlQsbZ9q03Nea4b1jWALXDYm0wUyNOMf7ISC3tu2n7rRsjis1hN001EO4RMSx
STRIPE_PUBLISHABLE_KEY=pk_test_51RhtlSCZ786xVLD8uQNGT3ObUPPibeq0N0El1DF6sSfHFV4XOZdNQAFRm5ncgyKZAKP491iCs5N4OOYJAhAxJt9c00tokfht6j
```

### Step 2: Configure Vercel Environment Variables

#### Frontend Vercel Environment Variables
```bash
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
VITE_API_URL=https://simples-connect-backend.vercel.app
VITE_DOMAIN=https://simplesconnect.com
```

#### Backend Vercel Environment Variables
```bash
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_KEY=your_supabase_service_key_here
JWT_SECRET=your_jwt_secret_here
DOMAIN=https://simplesconnect.com
# ... plus all your Stripe variables
```

### Step 3: Configure Google OAuth in Supabase

1. Go to your Supabase Dashboard
2. Navigate to Authentication → Providers
3. Enable Google OAuth
4. Set these redirect URLs:
   - `https://simplesconnect.com/auth-callback`
   - `https://your-project-id.supabase.co/auth/v1/callback`

### Step 4: Get Your Supabase Values

1. Go to your Supabase Dashboard
2. Navigate to Settings → API
3. Copy these values:
   - **Project URL** → Use as `SUPABASE_URL`
   - **Project API keys** → `anon public` → Use as `SUPABASE_ANON_KEY`
   - **Project API keys** → `service_role` → Use as `SUPABASE_SERVICE_KEY`

### Step 5: Update Google OAuth Configuration

In your Google Cloud Console:
1. Go to APIs & Services → Credentials
2. Edit your OAuth 2.0 Client ID
3. Add these authorized redirect URIs:
   - `https://your-project-id.supabase.co/auth/v1/callback`
   - `https://simplesconnect.com/auth-callback`

## 🔧 Quick Fix Commands

### 1. Create Environment Files
```bash
# In project root
touch frontend/.env
touch backend/.env

# Add the configuration above to each file
```

### 2. Deploy to Vercel
```bash
# From project root
vercel --prod
```

### 3. Set Vercel Environment Variables
```bash
# Frontend project
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
vercel env add VITE_API_URL
vercel env add VITE_DOMAIN

# Backend project
vercel env add SUPABASE_URL
vercel env add SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_KEY
vercel env add JWT_SECRET
vercel env add DOMAIN
```

## 🧪 Test the Fixes

### Test Google Login
1. Visit `https://simplesconnect.com`
2. Click "Sign In" → "Continue with Google"
3. Should redirect to Google OAuth
4. Should redirect back to your app successfully

### Test Discover Page
1. Login successfully
2. Navigate to Discover page
3. Should load potential matches
4. Should be able to like/pass on profiles

## 📝 Additional Notes

- Make sure both frontend and backend are deployed to Vercel
- Check Vercel function logs for any errors
- Test locally first with the environment variables
- Ensure your Supabase project is active and not paused

## 🚨 Security Notes

- Never commit .env files to Git
- Use different keys for production vs development
- Regularly rotate your API keys
- Monitor your usage in Supabase dashboard 