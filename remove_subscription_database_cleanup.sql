-- Remove All Subscription-Related Data from Supabase Database
-- Run this in your Supabase SQL Editor to completely clean up subscription components

-- ===================================================================
-- 1. REMOVE SUBSCRIPTION COLUMNS FROM PROFILES TABLE
-- ===================================================================

-- Check if subscription columns exist before trying to drop them
DO $$
BEGIN
    -- Drop subscription_tier column if it exists
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'profiles' AND column_name = 'subscription_tier') THEN
        ALTER TABLE profiles DROP COLUMN subscription_tier;
        RAISE NOTICE 'Dropped subscription_tier column';
    END IF;

    -- Drop subscription_status column if it exists
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'profiles' AND column_name = 'subscription_status') THEN
        ALTER TABLE profiles DROP COLUMN subscription_status;
        RAISE NOTICE 'Dropped subscription_status column';
    END IF;

    -- Drop stripe_customer_id column if it exists
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'profiles' AND column_name = 'stripe_customer_id') THEN
        ALTER TABLE profiles DROP COLUMN stripe_customer_id;
        RAISE NOTICE 'Dropped stripe_customer_id column';
    END IF;

    -- Drop subscription_id column if it exists
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'profiles' AND column_name = 'subscription_id') THEN
        ALTER TABLE profiles DROP COLUMN subscription_id;
        RAISE NOTICE 'Dropped subscription_id column';
    END IF;

    -- Drop trial_ends_at column if it exists
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'profiles' AND column_name = 'trial_ends_at') THEN
        ALTER TABLE profiles DROP COLUMN trial_ends_at;
        RAISE NOTICE 'Dropped trial_ends_at column';
    END IF;

    -- Drop subscription_starts_at column if it exists
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'profiles' AND column_name = 'subscription_starts_at') THEN
        ALTER TABLE profiles DROP COLUMN subscription_starts_at;
        RAISE NOTICE 'Dropped subscription_starts_at column';
    END IF;

    -- Drop subscription_ends_at column if it exists
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'profiles' AND column_name = 'subscription_ends_at') THEN
        ALTER TABLE profiles DROP COLUMN subscription_ends_at;
        RAISE NOTICE 'Dropped subscription_ends_at column';
    END IF;

    -- Drop billing_cycle column if it exists
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'profiles' AND column_name = 'billing_cycle') THEN
        ALTER TABLE profiles DROP COLUMN billing_cycle;
        RAISE NOTICE 'Dropped billing_cycle column';
    END IF;

    -- Drop plan_name column if it exists
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'profiles' AND column_name = 'plan_name') THEN
        ALTER TABLE profiles DROP COLUMN plan_name;
        RAISE NOTICE 'Dropped plan_name column';
    END IF;

    -- Drop is_premium column if it exists
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'profiles' AND column_name = 'is_premium') THEN
        ALTER TABLE profiles DROP COLUMN is_premium;
        RAISE NOTICE 'Dropped is_premium column';
    END IF;

    -- Drop is_vip column if it exists
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'profiles' AND column_name = 'is_vip') THEN
        ALTER TABLE profiles DROP COLUMN is_vip;
        RAISE NOTICE 'Dropped is_vip column';
    END IF;

    -- Drop is_founding_member column if it exists
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'profiles' AND column_name = 'is_founding_member') THEN
        ALTER TABLE profiles DROP COLUMN is_founding_member;
        RAISE NOTICE 'Dropped is_founding_member column';
    END IF;

    -- Drop swipe_count column if it exists
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'profiles' AND column_name = 'swipe_count') THEN
        ALTER TABLE profiles DROP COLUMN swipe_count;
        RAISE NOTICE 'Dropped swipe_count column';
    END IF;

    -- Drop daily_swipe_count column if it exists
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'profiles' AND column_name = 'daily_swipe_count') THEN
        ALTER TABLE profiles DROP COLUMN daily_swipe_count;
        RAISE NOTICE 'Dropped daily_swipe_count column';
    END IF;

    -- Drop swipe_reset_date column if it exists
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'profiles' AND column_name = 'swipe_reset_date') THEN
        ALTER TABLE profiles DROP COLUMN swipe_reset_date;
        RAISE NOTICE 'Dropped swipe_reset_date column';
    END IF;

    -- Drop message_count column if it exists
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'profiles' AND column_name = 'message_count') THEN
        ALTER TABLE profiles DROP COLUMN message_count;
        RAISE NOTICE 'Dropped message_count column';
    END IF;

    -- Drop super_like_count column if it exists
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'profiles' AND column_name = 'super_like_count') THEN
        ALTER TABLE profiles DROP COLUMN super_like_count;
        RAISE NOTICE 'Dropped super_like_count column';
    END IF;

    -- Drop daily_super_like_count column if it exists
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'profiles' AND column_name = 'daily_super_like_count') THEN
        ALTER TABLE profiles DROP COLUMN daily_super_like_count;
        RAISE NOTICE 'Dropped daily_super_like_count column';
    END IF;

END $$;

-- ===================================================================
-- 2. REMOVE SUBSCRIPTION-RELATED TABLES
-- ===================================================================

-- Drop subscription_logs table if it exists
DROP TABLE IF EXISTS subscription_logs CASCADE;

-- Drop subscriptions table if it exists
DROP TABLE IF EXISTS subscriptions CASCADE;

-- Drop user_subscriptions table if it exists
DROP TABLE IF EXISTS user_subscriptions CASCADE;

-- Drop billing_history table if it exists
DROP TABLE IF EXISTS billing_history CASCADE;

-- Drop payment_methods table if it exists
DROP TABLE IF EXISTS payment_methods CASCADE;

-- Drop subscription_plans table if it exists
DROP TABLE IF EXISTS subscription_plans CASCADE;

-- Drop stripe_events table if it exists
DROP TABLE IF EXISTS stripe_events CASCADE;

-- Drop usage_tracking table if it exists
DROP TABLE IF EXISTS usage_tracking CASCADE;

-- Drop promo_codes table if it exists
DROP TABLE IF EXISTS promo_codes CASCADE;

-- Drop user_promo_codes table if it exists
DROP TABLE IF EXISTS user_promo_codes CASCADE;

-- ===================================================================
-- 3. REMOVE SUBSCRIPTION-RELATED VIEWS
-- ===================================================================

-- Drop subscription-related views if they exist
DROP VIEW IF EXISTS user_subscription_status CASCADE;
DROP VIEW IF EXISTS active_subscriptions CASCADE;
DROP VIEW IF EXISTS subscription_analytics CASCADE;
DROP VIEW IF EXISTS premium_users CASCADE;
DROP VIEW IF EXISTS vip_users CASCADE;
DROP VIEW IF EXISTS trial_users CASCADE;

-- ===================================================================
-- 4. REMOVE SUBSCRIPTION-RELATED FUNCTIONS
-- ===================================================================

-- Drop subscription-related functions if they exist
DROP FUNCTION IF EXISTS check_subscription_status(UUID) CASCADE;
DROP FUNCTION IF EXISTS update_subscription_status(UUID, TEXT) CASCADE;
DROP FUNCTION IF EXISTS reset_daily_limits() CASCADE;
DROP FUNCTION IF EXISTS check_swipe_limit(UUID) CASCADE;
DROP FUNCTION IF EXISTS check_super_like_limit(UUID) CASCADE;
DROP FUNCTION IF EXISTS increment_usage_count(UUID, TEXT) CASCADE;
DROP FUNCTION IF EXISTS is_premium_user(UUID) CASCADE;
DROP FUNCTION IF EXISTS is_vip_user(UUID) CASCADE;
DROP FUNCTION IF EXISTS get_user_limits(UUID) CASCADE;
DROP FUNCTION IF EXISTS handle_subscription_change() CASCADE;

-- ===================================================================
-- 5. REMOVE SUBSCRIPTION-RELATED TRIGGERS
-- ===================================================================

-- Drop subscription-related triggers if they exist
DROP TRIGGER IF EXISTS subscription_status_trigger ON profiles;
DROP TRIGGER IF EXISTS daily_limit_reset_trigger ON profiles;
DROP TRIGGER IF EXISTS subscription_change_trigger ON subscriptions;

-- ===================================================================
-- 6. REMOVE SUBSCRIPTION-RELATED POLICIES
-- ===================================================================

-- Drop subscription-related RLS policies if they exist
DROP POLICY IF EXISTS "Users can view own subscription" ON subscriptions;
DROP POLICY IF EXISTS "Users can update own subscription" ON subscriptions;
DROP POLICY IF EXISTS "Premium users can access premium features" ON profiles;
DROP POLICY IF EXISTS "VIP users can access VIP features" ON profiles;

-- ===================================================================
-- 7. CLEAN UP INDEXES
-- ===================================================================

-- Drop subscription-related indexes if they exist
DROP INDEX IF EXISTS idx_profiles_subscription_tier;
DROP INDEX IF EXISTS idx_profiles_subscription_status;
DROP INDEX IF EXISTS idx_profiles_stripe_customer_id;
DROP INDEX IF EXISTS idx_profiles_trial_ends_at;
DROP INDEX IF EXISTS idx_profiles_subscription_ends_at;
DROP INDEX IF EXISTS idx_subscriptions_user_id;
DROP INDEX IF EXISTS idx_subscriptions_status;
DROP INDEX IF EXISTS idx_subscription_logs_user_id;
DROP INDEX IF EXISTS idx_usage_tracking_user_id;

-- ===================================================================
-- 8. VERIFICATION QUERIES
-- ===================================================================

-- Check remaining columns in profiles table
SELECT 'Remaining columns in profiles table:' as info;
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
ORDER BY ordinal_position;

-- Check for any remaining subscription-related tables
SELECT 'Remaining tables:' as info;
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE '%subscription%' 
OR table_name LIKE '%billing%' 
OR table_name LIKE '%stripe%' 
OR table_name LIKE '%payment%' 
OR table_name LIKE '%promo%';

-- Check for any remaining subscription-related functions
SELECT 'Remaining functions:' as info;
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND (routine_name LIKE '%subscription%' 
OR routine_name LIKE '%billing%' 
OR routine_name LIKE '%stripe%' 
OR routine_name LIKE '%payment%' 
OR routine_name LIKE '%premium%' 
OR routine_name LIKE '%vip%');

-- ===================================================================
-- 9. SUCCESS MESSAGE
-- ===================================================================

DO $$
BEGIN
    RAISE NOTICE '=======================================================';
    RAISE NOTICE 'SUBSCRIPTION CLEANUP COMPLETED SUCCESSFULLY!';
    RAISE NOTICE '=======================================================';
    RAISE NOTICE 'All subscription-related database components removed:';
    RAISE NOTICE '✅ Subscription columns from profiles table';
    RAISE NOTICE '✅ Subscription-related tables';
    RAISE NOTICE '✅ Subscription-related views';
    RAISE NOTICE '✅ Subscription-related functions';
    RAISE NOTICE '✅ Subscription-related triggers';
    RAISE NOTICE '✅ Subscription-related policies';
    RAISE NOTICE '✅ Subscription-related indexes';
    RAISE NOTICE '=======================================================';
    RAISE NOTICE 'Your database is now completely free of subscription components!';
    RAISE NOTICE 'The app can now operate as a completely free dating platform.';
    RAISE NOTICE '=======================================================';
END $$; 