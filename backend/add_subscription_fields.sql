-- Add subscription fields to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'free',
ADD COLUMN IF NOT EXISTS subscription_expiry TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS is_founding_member BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT,
ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days'),
ADD COLUMN IF NOT EXISTS daily_swipes_used INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_swipe_reset DATE DEFAULT CURRENT_DATE;

-- Create index for subscription queries
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_tier ON profiles(subscription_tier);
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_expiry ON profiles(subscription_expiry);
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer_id ON profiles(stripe_customer_id);

-- Update existing users to have trial period
UPDATE profiles 
SET trial_ends_at = NOW() + INTERVAL '30 days'
WHERE trial_ends_at IS NULL;

-- Create subscription_logs table for tracking changes
CREATE TABLE IF NOT EXISTS subscription_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL, -- 'trial_started', 'subscribed', 'cancelled', 'upgraded', 'downgraded'
    from_tier TEXT,
    to_tier TEXT,
    stripe_event_id TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for subscription logs
CREATE INDEX IF NOT EXISTS idx_subscription_logs_user_id ON subscription_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_subscription_logs_created_at ON subscription_logs(created_at);

-- Function to reset daily swipes
CREATE OR REPLACE FUNCTION reset_daily_swipes()
RETURNS void AS $$
BEGIN
    UPDATE profiles 
    SET daily_swipes_used = 0, 
        last_swipe_reset = CURRENT_DATE
    WHERE last_swipe_reset < CURRENT_DATE;
END;
$$ LANGUAGE plpgsql;

-- Create a scheduled job to reset daily swipes (if pg_cron is available)
-- SELECT cron.schedule('reset-daily-swipes', '0 0 * * *', 'SELECT reset_daily_swipes();');

COMMENT ON COLUMN profiles.subscription_tier IS 'User subscription tier: free, community, premium, vip';
COMMENT ON COLUMN profiles.subscription_expiry IS 'When the current subscription expires';
COMMENT ON COLUMN profiles.is_founding_member IS 'Special flag for early adopters with extended benefits';
COMMENT ON COLUMN profiles.stripe_customer_id IS 'Stripe customer ID for payment management';
COMMENT ON COLUMN profiles.stripe_subscription_id IS 'Active Stripe subscription ID';
COMMENT ON COLUMN profiles.trial_ends_at IS 'When the free trial period ends';
COMMENT ON COLUMN profiles.daily_swipes_used IS 'Number of swipes used today (for community tier limit)';
COMMENT ON COLUMN profiles.last_swipe_reset IS 'Last date when daily swipes were reset'; 