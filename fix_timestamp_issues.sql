-- Fix Timestamp Inconsistencies Across the App
-- This script standardizes all timestamp columns to use consistent naming
-- Run this in your Supabase SQL Editor

-- =====================================================
-- 1. FIX LAST_ACTIVE COLUMN NAMING INCONSISTENCY
-- =====================================================

DO $$ 
BEGIN
  -- Check if last_active column exists and rename/update if needed
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'last_active') THEN
    -- If last_active exists but last_active_at doesn't, rename it
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'last_active_at') THEN
      ALTER TABLE profiles RENAME COLUMN last_active TO last_active_at;
      RAISE NOTICE 'Renamed last_active to last_active_at';
    ELSE
      -- Both exist, drop the old one and keep last_active_at
      ALTER TABLE profiles DROP COLUMN last_active;
      RAISE NOTICE 'Dropped duplicate last_active column, kept last_active_at';
    END IF;
  END IF;
  
  -- Add last_active_at if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'last_active_at') THEN
    ALTER TABLE profiles ADD COLUMN last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    RAISE NOTICE 'Added last_active_at column';
  END IF;
END $$;

-- =====================================================
-- 2. UPDATE INDEXES TO USE CONSISTENT COLUMN NAMES
-- =====================================================

-- Drop old index if it exists
DROP INDEX IF EXISTS idx_profiles_last_active;

-- Create new index with correct column name
CREATE INDEX IF NOT EXISTS idx_profiles_last_active_at ON profiles(last_active_at DESC);

-- =====================================================
-- 3. UPDATE MATCHING FUNCTIONS TO USE CORRECT COLUMN
-- =====================================================

-- Update find_potential_matches function to use last_active_at
CREATE OR REPLACE FUNCTION find_potential_matches(
  current_user_id UUID,
  match_limit INTEGER DEFAULT 10
)
RETURNS TABLE (
  user_id UUID,
  full_name TEXT,
  age INTEGER,
  bio TEXT,
  profile_picture_url TEXT,
  interests TEXT[],
  location TEXT,
  gender TEXT,
  looking_for TEXT,
  match_score INTEGER,
  match_label TEXT,
  vibe TEXT,
  life_phase TEXT,
  intentions TEXT[],
  shared_intentions TEXT[],
  shared_interests TEXT[],
  communication_style TEXT[],
  emotional_availability TEXT,
  region_preference TEXT[]
)
LANGUAGE plpgsql
AS $$
DECLARE
  current_user_record profiles%ROWTYPE;
BEGIN
  -- Get current user's profile
  SELECT * INTO current_user_record FROM profiles WHERE id = current_user_id;
  
  -- If user doesn't exist, return empty
  IF current_user_record.id IS NULL THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT 
    p.id,
    p.full_name,
    EXTRACT(YEAR FROM AGE(p.birthdate))::INTEGER as age,
    p.bio,
    p.profile_picture_url,
    p.interests,
    p.location,
    p.gender,
    p.looking_for,
    calculate_match_score(current_user_id, p.id) as match_score,
    get_match_label(calculate_match_score(current_user_id, p.id)) as match_label,
    p.vibe,
    p.life_phase,
    p.intentions,
    -- Calculate shared intentions
    CASE 
      WHEN current_user_record.intentions IS NOT NULL AND p.intentions IS NOT NULL 
      THEN current_user_record.intentions & p.intentions
      ELSE ARRAY[]::TEXT[]
    END as shared_intentions,
    -- Calculate shared interests  
    CASE 
      WHEN current_user_record.interests IS NOT NULL AND p.interests IS NOT NULL 
      THEN current_user_record.interests & p.interests
      ELSE ARRAY[]::TEXT[]
    END as shared_interests,
    p.communication_style,
    p.emotional_availability,
    p.region_preference
  FROM profiles p
  WHERE p.id != current_user_id
    AND p.is_active = true
    AND p.is_profile_complete = true
    AND (current_user_record.looking_for = 'everyone' 
         OR (current_user_record.looking_for = 'men' AND p.gender = 'man')
         OR (current_user_record.looking_for = 'women' AND p.gender = 'woman'))
    AND (p.looking_for = 'everyone' 
         OR (p.looking_for = 'men' AND current_user_record.gender = 'man')
         OR (p.looking_for = 'women' AND current_user_record.gender = 'woman'))
    -- Exclude users already interacted with
    AND p.id NOT IN (
      SELECT target_user_id FROM user_interactions 
      WHERE user_id = current_user_id
    )
  ORDER BY 
    calculate_match_score(current_user_id, p.id) DESC,
    p.value_alignment_score DESC,
    p.timezone_overlap_score DESC,
    p.last_active_at DESC  -- Fixed: use last_active_at instead of last_active
  LIMIT match_limit;
END;
$$;

-- =====================================================
-- 4. ENSURE ALL TIMESTAMP COLUMNS HAVE PROPER DEFAULTS
-- =====================================================

-- Update profiles table timestamp defaults
ALTER TABLE profiles ALTER COLUMN created_at SET DEFAULT NOW();
ALTER TABLE profiles ALTER COLUMN updated_at SET DEFAULT NOW();
ALTER TABLE profiles ALTER COLUMN last_active_at SET DEFAULT NOW();

-- Update user_interactions table
ALTER TABLE user_interactions ALTER COLUMN created_at SET DEFAULT NOW();

-- Update matches table
ALTER TABLE matches ALTER COLUMN created_at SET DEFAULT NOW();

-- Update messages table if it exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'messages') THEN
    ALTER TABLE messages ALTER COLUMN created_at SET DEFAULT NOW();
  END IF;
END $$;

-- =====================================================
-- 5. CREATE TRIGGER TO AUTO-UPDATE LAST_ACTIVE_AT
-- =====================================================

-- Create function to update last_active_at
CREATE OR REPLACE FUNCTION update_last_active()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_active_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS trigger_update_last_active ON profiles;

-- Create trigger to automatically update last_active_at on profile updates
CREATE TRIGGER trigger_update_last_active
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_last_active();

-- =====================================================
-- 6. CREATE FUNCTION TO MANUALLY UPDATE LAST_ACTIVE_AT
-- =====================================================

-- Function to update user's last active timestamp (for login tracking)
CREATE OR REPLACE FUNCTION update_user_last_active(user_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE profiles 
  SET last_active_at = NOW() 
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 7. VERIFICATION QUERIES
-- =====================================================

-- Check timestamp columns in profiles table
SELECT 
  column_name, 
  data_type, 
  column_default,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'profiles' 
  AND column_name IN ('created_at', 'updated_at', 'last_active_at', 'last_active')
ORDER BY column_name;

-- Check if indexes exist
SELECT 
  indexname,
  indexdef
FROM pg_indexes 
WHERE tablename = 'profiles' 
  AND indexname LIKE '%last_active%'
ORDER BY indexname;

SELECT 'Timestamp issues fixed successfully!' as status;
