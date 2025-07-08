-- Complete Matching System Setup for Simples Connect (FIXED VERSION)
-- Run this in your Supabase SQL Editor

-- First, ensure the profiles table has all necessary columns
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS birthdate DATE,
ADD COLUMN IF NOT EXISTS interests TEXT[],
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS gender TEXT,
ADD COLUMN IF NOT EXISTS looking_for TEXT,
ADD COLUMN IF NOT EXISTS is_profile_complete BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS gallery_images TEXT[],
ADD COLUMN IF NOT EXISTS gallery_video TEXT,
ADD COLUMN IF NOT EXISTS email TEXT;

-- Add unique constraint on email if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'profiles_email_unique' 
        AND table_name = 'profiles'
    ) THEN
        ALTER TABLE profiles ADD CONSTRAINT profiles_email_unique UNIQUE (email);
    END IF;
END $$;

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS user_interactions CASCADE;
DROP TABLE IF EXISTS matches CASCADE;

-- User interactions table (likes, passes)
CREATE TABLE user_interactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  target_user_id UUID NOT NULL,
  interaction_type VARCHAR(10) CHECK (interaction_type IN ('like', 'pass')) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_interaction UNIQUE(user_id, target_user_id),
  CONSTRAINT fk_user_interactions_user_id FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE,
  CONSTRAINT fk_user_interactions_target_user_id FOREIGN KEY (target_user_id) REFERENCES profiles(id) ON DELETE CASCADE
);

-- Matches table (when two users like each other)
CREATE TABLE matches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user1_id UUID NOT NULL,
  user2_id UUID NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_match UNIQUE(user1_id, user2_id),
  CONSTRAINT fk_matches_user1_id FOREIGN KEY (user1_id) REFERENCES profiles(id) ON DELETE CASCADE,
  CONSTRAINT fk_matches_user2_id FOREIGN KEY (user2_id) REFERENCES profiles(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_user_interactions_user_id ON user_interactions(user_id);
CREATE INDEX idx_user_interactions_target_user_id ON user_interactions(target_user_id);
CREATE INDEX idx_user_interactions_type ON user_interactions(interaction_type);
CREATE INDEX idx_matches_user1_id ON matches(user1_id);
CREATE INDEX idx_matches_user2_id ON matches(user2_id);
CREATE INDEX idx_matches_active ON matches(is_active);
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_complete ON profiles(is_profile_complete);

-- Row Level Security policies
ALTER TABLE user_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

-- Drop existing policies first
DROP POLICY IF EXISTS "Users can insert their own interactions" ON user_interactions;
DROP POLICY IF EXISTS "Users can view their own interactions" ON user_interactions;
DROP POLICY IF EXISTS "Users can view their own matches" ON matches;
DROP POLICY IF EXISTS "System can create matches" ON matches;
DROP POLICY IF EXISTS "Users can update their own matches" ON matches;

-- User interactions policies
CREATE POLICY "Users can insert their own interactions" ON user_interactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own interactions" ON user_interactions
  FOR SELECT USING (auth.uid() = user_id OR auth.uid() = target_user_id);

-- Matches policies
CREATE POLICY "Users can view their own matches" ON matches
  FOR SELECT USING (auth.uid() = user1_id OR auth.uid() = user2_id);

CREATE POLICY "System can create matches" ON matches
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own matches" ON matches
  FOR UPDATE USING (auth.uid() = user1_id OR auth.uid() = user2_id);

-- Function to ensure user1_id is always less than user2_id (to avoid duplicates)
CREATE OR REPLACE FUNCTION ensure_match_order()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.user1_id > NEW.user2_id THEN
    -- Swap the user IDs to maintain order
    NEW.user1_id := OLD.user2_id;
    NEW.user2_id := OLD.user1_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for the matches table
DROP TRIGGER IF EXISTS ensure_match_order_trigger ON matches;
CREATE TRIGGER ensure_match_order_trigger
  BEFORE INSERT OR UPDATE ON matches
  FOR EACH ROW
  EXECUTE FUNCTION ensure_match_order();

-- Clear existing dummy data using UUIDs (more reliable than names)
DELETE FROM profiles WHERE id IN (
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  '33333333-3333-3333-3333-333333333333',
  '44444444-4444-4444-4444-444444444444',
  '55555555-5555-5555-5555-555555555555',
  '66666666-6666-6666-6666-666666666666',
  '77777777-7777-7777-7777-777777777777',
  '88888888-8888-8888-8888-888888888888',
  '99999999-9999-9999-9999-999999999999',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
);

-- Insert dummy users for testing with proper email addresses
INSERT INTO profiles (
  id, 
  full_name,
  email,
  birthdate, 
  bio, 
  profile_picture_url, 
  interests, 
  location, 
  gender, 
  looking_for, 
  is_profile_complete
) VALUES 
(
  '11111111-1111-1111-1111-111111111111',
  'Emma Johnson',
  'emma.johnson@simplesconnect.com',
  '1995-03-15',
  'Love hiking, coffee, and good conversations! Always up for an adventure.',
  'https://images.unsplash.com/photo-1494790108755-2616b612b29c?w=400&h=400&fit=crop&crop=face',
  ARRAY['hiking', 'coffee', 'travel', 'photography'],
  'San Francisco, CA',
  'woman',
  'men',
  true
),
(
  '22222222-2222-2222-2222-222222222222',
  'Alex Rodriguez',
  'alex.rodriguez@simplesconnect.com',
  '1992-08-22',
  'Fitness enthusiast and dog lover. Looking for someone to explore the city with!',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
  ARRAY['fitness', 'dogs', 'music', 'cooking'],
  'San Francisco, CA',
  'man',
  'women',
  true
),
(
  '33333333-3333-3333-3333-333333333333',
  'Maya Patel',
  'maya.patel@simplesconnect.com',
  '1997-11-08',
  'Artist and yoga teacher. Seeking genuine connections and meaningful conversations.',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
  ARRAY['art', 'yoga', 'meditation', 'nature'],
  'Los Angeles, CA',
  'woman',
  'everyone',
  true
),
(
  '44444444-4444-4444-4444-444444444444',
  'David Chen',
  'david.chen@simplesconnect.com',
  '1993-05-17',
  'Software engineer who loves board games and trying new restaurants.',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
  ARRAY['technology', 'board games', 'food', 'movies'],
  'San Francisco, CA',
  'man',
  'women',
  true
),
(
  '55555555-5555-5555-5555-555555555555',
  'Sarah Williams',
  'sarah.williams@simplesconnect.com',
  '1994-12-03',
  'Professional photographer with a passion for travel and storytelling.',
  'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400&h=400&fit=crop&crop=face',
  ARRAY['photography', 'travel', 'writing', 'adventure'],
  'New York, NY',
  'woman',
  'men',
  true
),
(
  '66666666-6666-6666-6666-666666666666',
  'Michael Thompson',
  'michael.thompson@simplesconnect.com',
  '1991-09-14',
  'Musician and teacher. Love live music, good books, and deep conversations.',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
  ARRAY['music', 'books', 'teaching', 'concerts'],
  'Austin, TX',
  'man',
  'women',
  true
),
(
  '77777777-7777-7777-7777-777777777777',
  'Lisa Garcia',
  'lisa.garcia@simplesconnect.com',
  '1996-02-28',
  'Marketing professional who enjoys wine tasting and weekend getaways.',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face',
  ARRAY['wine', 'travel', 'marketing', 'beaches'],
  'Los Angeles, CA',
  'woman',
  'men',
  true
),
(
  '88888888-8888-8888-8888-888888888888',
  'James Wilson',
  'james.wilson@simplesconnect.com',
  '1990-06-11',
  'Chef and food blogger. Always experimenting with new recipes!',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face',
  ARRAY['cooking', 'food', 'blogging', 'restaurants'],
  'Chicago, IL',
  'man',
  'women',
  true
),
(
  '99999999-9999-9999-9999-999999999999',
  'Amanda Taylor',
  'amanda.taylor@simplesconnect.com',
  '1995-07-25',
  'Veterinarian and animal lover. Spend my free time volunteering at shelters.',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop&crop=face',
  ARRAY['animals', 'volunteering', 'veterinary', 'hiking'],
  'Denver, CO',
  'woman',
  'men',
  true
),
(
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'Ryan Martinez',
  'ryan.martinez@simplesconnect.com',
  '1994-04-09',
  'Personal trainer and outdoor enthusiast. Love rock climbing and skiing!',
  'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&h=400&fit=crop&crop=face',
  ARRAY['fitness', 'rock climbing', 'skiing', 'outdoors'],
  'Boulder, CO',
  'man',
  'women',
  true
);

-- Test if the setup worked
SELECT 'Setup complete! Created profiles:' as message, COUNT(*) as total_profiles 
FROM profiles WHERE id IN (
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  '33333333-3333-3333-3333-333333333333',
  '44444444-4444-4444-4444-444444444444',
  '55555555-5555-5555-5555-555555555555',
  '66666666-6666-6666-6666-666666666666',
  '77777777-7777-7777-7777-777777777777',
  '88888888-8888-8888-8888-888888888888',
  '99999999-9999-9999-9999-999999999999',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
);

SELECT 'Profiles with complete profiles:' as message, COUNT(*) as complete_profiles 
FROM profiles WHERE is_profile_complete = true;

-- Test email uniqueness
SELECT 'Email uniqueness check:' as message, 
       CASE WHEN COUNT(*) = COUNT(DISTINCT email) 
       THEN 'PASS - All emails are unique' 
       ELSE 'FAIL - Duplicate emails found' 
       END as result
FROM profiles WHERE email IS NOT NULL;

-- Test interactions table
SELECT 'User interactions table exists:' as message, 
       CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_interactions') 
       THEN 'YES' ELSE 'NO' END as exists;

-- Test matches table
SELECT 'Matches table exists:' as message, 
       CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'matches') 
       THEN 'YES' ELSE 'NO' END as exists;

-- Show sample profiles for verification
SELECT id, full_name, email, birthdate, location, array_length(interests, 1) as interest_count
FROM profiles 
WHERE is_profile_complete = true 
LIMIT 5;

-- Verify unique constraints
SELECT 'Unique constraints check:' as message,
       CASE WHEN EXISTS (
         SELECT 1 FROM information_schema.table_constraints 
         WHERE constraint_name = 'profiles_email_unique' 
         AND table_name = 'profiles'
       ) THEN 'Email unique constraint exists' 
       ELSE 'Email unique constraint missing' 
       END as result; 