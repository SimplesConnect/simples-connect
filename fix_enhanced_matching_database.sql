-- Fix Enhanced Matching Database Schema
-- This script ensures all enhanced matching fields exist in the profiles table
-- Run this in your Supabase SQL Editor

-- =====================================================
-- 1. ADD ENHANCED MATCHING COLUMNS TO PROFILES TABLE
-- =====================================================

-- Add enhanced matching columns to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS intentions TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN IF NOT EXISTS vibe TEXT,
ADD COLUMN IF NOT EXISTS life_phase TEXT,
ADD COLUMN IF NOT EXISTS timezone_overlap_score INTEGER DEFAULT 5 CHECK (timezone_overlap_score >= 0 AND timezone_overlap_score <= 10),
ADD COLUMN IF NOT EXISTS value_alignment_score INTEGER DEFAULT 5 CHECK (value_alignment_score >= 0 AND value_alignment_score <= 10),
ADD COLUMN IF NOT EXISTS communication_style TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN IF NOT EXISTS emotional_availability TEXT,
ADD COLUMN IF NOT EXISTS region_preference TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN IF NOT EXISTS conversation_boundaries TEXT;

-- Add missing basic columns if they don't exist
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS birthdate DATE,
ADD COLUMN IF NOT EXISTS gallery_images TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN IF NOT EXISTS gallery_video TEXT;

-- =====================================================
-- 2. UPDATE CONSTRAINT VALUES TO MATCH FRONTEND
-- =====================================================

-- Drop existing constraints if they exist to avoid conflicts
DO $$ 
BEGIN
  -- Drop existing constraints if they exist
  IF EXISTS (SELECT 1 FROM information_schema.constraint_column_usage WHERE constraint_name = 'check_vibe_values') THEN
    ALTER TABLE profiles DROP CONSTRAINT check_vibe_values;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.constraint_column_usage WHERE constraint_name = 'check_life_phase_values') THEN
    ALTER TABLE profiles DROP CONSTRAINT check_life_phase_values;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.constraint_column_usage WHERE constraint_name = 'check_emotional_availability_values') THEN
    ALTER TABLE profiles DROP CONSTRAINT check_emotional_availability_values;
  END IF;
END $$;

-- Add updated constraints that match the frontend options
ALTER TABLE profiles 
ADD CONSTRAINT check_vibe_values 
CHECK (vibe IN ('deep', 'light', 'funny', 'intellectual', 'adventurous', 'chill', 'quiet', 'creative'));

ALTER TABLE profiles 
ADD CONSTRAINT check_life_phase_values 
CHECK (life_phase IN ('student', 'new_parent', 'relocating', 'hustle_season', 'career_transition', 'settling_down', 'exploring', 'established'));

ALTER TABLE profiles 
ADD CONSTRAINT check_emotional_availability_values 
CHECK (emotional_availability IN ('guarded', 'open', 'healing', 'selective', 'ready'));

-- =====================================================
-- 3. CREATE INDEXES FOR ENHANCED MATCHING PERFORMANCE
-- =====================================================

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_intentions ON profiles USING GIN (intentions);
CREATE INDEX IF NOT EXISTS idx_profiles_vibe ON profiles (vibe);
CREATE INDEX IF NOT EXISTS idx_profiles_life_phase ON profiles (life_phase);
CREATE INDEX IF NOT EXISTS idx_profiles_value_alignment_score ON profiles (value_alignment_score DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_timezone_overlap_score ON profiles (timezone_overlap_score DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_communication_style ON profiles USING GIN (communication_style);
CREATE INDEX IF NOT EXISTS idx_profiles_emotional_availability ON profiles (emotional_availability);
CREATE INDEX IF NOT EXISTS idx_profiles_region_preference ON profiles USING GIN (region_preference);

-- =====================================================
-- 4. FIX TIMESTAMP COLUMNS CONSISTENCY
-- =====================================================

-- Ensure consistent timestamp columns with proper defaults
DO $$ 
BEGIN
  -- Check if last_active column exists and rename/update if needed
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'last_active') THEN
    -- If last_active exists but last_active_at doesn't, rename it
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'last_active_at') THEN
      ALTER TABLE profiles RENAME COLUMN last_active TO last_active_at;
    ELSE
      -- Both exist, drop the old one
      ALTER TABLE profiles DROP COLUMN last_active;
    END IF;
  END IF;
  
  -- Add last_active_at if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'last_active_at') THEN
    ALTER TABLE profiles ADD COLUMN last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
  END IF;
  
  -- Ensure created_at and updated_at have proper defaults
  ALTER TABLE profiles ALTER COLUMN created_at SET DEFAULT NOW();
  ALTER TABLE profiles ALTER COLUMN updated_at SET DEFAULT NOW();
END $$;

-- =====================================================
-- 5. CREATE MATCHING FUNCTIONS IF THEY DON'T EXIST
-- =====================================================

-- Create or replace the enhanced matching score function
CREATE OR REPLACE FUNCTION calculate_match_score(
  current_user_id UUID,
  target_user_id UUID
) 
RETURNS INTEGER 
LANGUAGE plpgsql 
AS $$
DECLARE
  current_user profiles%ROWTYPE;
  target_user profiles%ROWTYPE;
  score INTEGER := 0;
  shared_interests_count INTEGER := 0;
  shared_intentions_count INTEGER := 0;
  shared_communication_count INTEGER := 0;
  shared_regions_count INTEGER := 0;
BEGIN
  -- Get user profiles
  SELECT * INTO current_user FROM profiles WHERE id = current_user_id;
  SELECT * INTO target_user FROM profiles WHERE id = target_user_id;
  
  -- Check if users exist
  IF current_user.id IS NULL OR target_user.id IS NULL THEN
    RETURN 0;
  END IF;
  
  -- 1. Shared Interests (0-25 points)
  IF current_user.interests IS NOT NULL AND target_user.interests IS NOT NULL THEN
    SELECT cardinality(current_user.interests & target_user.interests) INTO shared_interests_count;
    score := score + LEAST(shared_interests_count * 5, 25);
  END IF;
  
  -- 2. Shared Intentions (0-20 points) - CRITICAL for compatibility
  IF current_user.intentions IS NOT NULL AND target_user.intentions IS NOT NULL THEN
    SELECT cardinality(current_user.intentions & target_user.intentions) INTO shared_intentions_count;
    IF shared_intentions_count > 0 THEN
      score := score + LEAST(shared_intentions_count * 10, 20);
    ELSE
      -- No shared intentions = major compatibility issue
      score := score - 15;
    END IF;
  END IF;
  
  -- 3. Vibe Compatibility (0-15 points)
  IF current_user.vibe IS NOT NULL AND target_user.vibe IS NOT NULL THEN
    IF current_user.vibe = target_user.vibe THEN
      score := score + 15;
    ELSIF (current_user.vibe IN ('deep', 'intellectual') AND target_user.vibe IN ('deep', 'intellectual')) OR
          (current_user.vibe IN ('light', 'funny') AND target_user.vibe IN ('light', 'funny')) OR
          (current_user.vibe IN ('chill', 'quiet') AND target_user.vibe IN ('chill', 'quiet')) THEN
      score := score + 10;
    END IF;
  END IF;
  
  -- 4. Life Phase Alignment (0-10 points)
  IF current_user.life_phase IS NOT NULL AND target_user.life_phase IS NOT NULL THEN
    IF current_user.life_phase = target_user.life_phase THEN
      score := score + 10;
    ELSIF (current_user.life_phase IN ('student', 'career_transition') AND target_user.life_phase IN ('student', 'career_transition')) OR
          (current_user.life_phase IN ('new_parent', 'settling_down') AND target_user.life_phase IN ('new_parent', 'settling_down')) THEN
      score := score + 5;
    END IF;
  END IF;
  
  -- 5. Value Alignment Score (0-10 points)
  IF current_user.value_alignment_score IS NOT NULL AND target_user.value_alignment_score IS NOT NULL THEN
    score := score + GREATEST(0, 10 - ABS(current_user.value_alignment_score - target_user.value_alignment_score));
  END IF;
  
  -- 6. Timezone Overlap Score (0-10 points)
  IF current_user.timezone_overlap_score IS NOT NULL AND target_user.timezone_overlap_score IS NOT NULL THEN
    score := score + GREATEST(0, 10 - ABS(current_user.timezone_overlap_score - target_user.timezone_overlap_score));
  END IF;
  
  -- 7. Communication Style Compatibility (0-10 points)
  IF current_user.communication_style IS NOT NULL AND target_user.communication_style IS NOT NULL THEN
    SELECT cardinality(current_user.communication_style & target_user.communication_style) INTO shared_communication_count;
    score := score + LEAST(shared_communication_count * 3, 10);
  END IF;
  
  -- 8. Regional Connection (0-5 points)
  IF current_user.region_preference IS NOT NULL AND target_user.region_preference IS NOT NULL THEN
    SELECT cardinality(current_user.region_preference & target_user.region_preference) INTO shared_regions_count;
    score := score + LEAST(shared_regions_count * 2, 5);
  END IF;
  
  -- 9. Emotional Availability Bonus/Penalty (0-5 points)
  IF current_user.emotional_availability IS NOT NULL AND target_user.emotional_availability IS NOT NULL THEN
    IF current_user.emotional_availability = 'open' AND target_user.emotional_availability = 'open' THEN
      score := score + 5;
    ELSIF current_user.emotional_availability = 'healing' AND target_user.emotional_availability = 'healing' THEN
      score := score + 3;
    ELSIF current_user.emotional_availability = 'guarded' AND target_user.emotional_availability = 'guarded' THEN
      score := score + 2;
    END IF;
  END IF;
  
  -- Ensure score is within bounds
  RETURN GREATEST(0, LEAST(score, 100));
END;
$$;

-- Create match label function
CREATE OR REPLACE FUNCTION get_match_label(match_score INTEGER) 
RETURNS TEXT 
LANGUAGE plpgsql 
AS $$
BEGIN
  IF match_score >= 60 THEN
    RETURN 'Great Fit';
  ELSIF match_score >= 40 THEN
    RETURN 'Worth Exploring';
  ELSE
    RETURN 'Vibe Mismatch';
  END IF;
END;
$$;

-- =====================================================
-- 6. UPDATE EXISTING USERS WITH DEFAULT VALUES
-- =====================================================

-- Set default values for existing users who don't have enhanced matching data
UPDATE profiles 
SET 
  intentions = ARRAY['friendship']::TEXT[],
  vibe = 'light',
  life_phase = 'exploring',
  timezone_overlap_score = 5,
  value_alignment_score = 5,
  communication_style = ARRAY['text']::TEXT[],
  emotional_availability = 'open'
WHERE (intentions IS NULL OR cardinality(intentions) = 0)
  AND is_profile_complete = true;

-- =====================================================
-- 7. VERIFICATION QUERY
-- =====================================================

-- Verify all columns exist
SELECT 
  column_name, 
  data_type, 
  is_nullable, 
  column_default
FROM information_schema.columns 
WHERE table_name = 'profiles' 
  AND column_name IN (
    'intentions', 'vibe', 'life_phase', 'timezone_overlap_score', 
    'value_alignment_score', 'communication_style', 'emotional_availability', 
    'region_preference', 'birthdate', 'gallery_images', 'gallery_video',
    'last_active_at', 'created_at', 'updated_at'
  )
ORDER BY column_name;

SELECT 'Enhanced matching database setup complete!' as status;
