-- Setup Enhanced Matching System for Simples Connect
-- Run this script in your Supabase SQL Editor to enable the enhanced matching features

-- =====================================================
-- 1. ENSURE ENHANCED MATCHING FIELDS EXIST
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

-- Add constraints for the new fields (drop existing if they exist)
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

-- Add new constraints
ALTER TABLE profiles 
ADD CONSTRAINT check_vibe_values 
CHECK (vibe IN ('deep', 'light', 'funny', 'quiet', 'adventurous', 'chill', 'intellectual', 'spiritual'));

ALTER TABLE profiles 
ADD CONSTRAINT check_life_phase_values 
CHECK (life_phase IN ('student', 'new parent', 'relocating', 'hustle season', 'career transition', 'settling down', 'exploring', 'established'));

ALTER TABLE profiles 
ADD CONSTRAINT check_emotional_availability_values 
CHECK (emotional_availability IN ('guarded', 'open', 'healing', 'selective', 'ready'));

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_intentions ON profiles USING GIN (intentions);
CREATE INDEX IF NOT EXISTS idx_profiles_vibe ON profiles (vibe);
CREATE INDEX IF NOT EXISTS idx_profiles_life_phase ON profiles (life_phase);
CREATE INDEX IF NOT EXISTS idx_profiles_value_alignment_score ON profiles (value_alignment_score DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_timezone_overlap_score ON profiles (timezone_overlap_score DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_communication_style ON profiles USING GIN (communication_style);
CREATE INDEX IF NOT EXISTS idx_profiles_region_preference ON profiles USING GIN (region_preference);

-- =====================================================
-- 2. ENSURE MATCHING FUNCTIONS EXIST
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
  SELECT cardinality(current_user.interests & target_user.interests) INTO shared_interests_count;
  score := score + LEAST(shared_interests_count * 5, 25);
  
  -- 2. Shared Intentions (0-20 points) - CRITICAL for compatibility
  SELECT cardinality(current_user.intentions & target_user.intentions) INTO shared_intentions_count;
  IF shared_intentions_count > 0 THEN
    score := score + LEAST(shared_intentions_count * 10, 20);
  ELSE
    -- No shared intentions = major compatibility issue
    score := score - 15;
  END IF;
  
  -- 3. Vibe Compatibility (0-15 points)
  IF current_user.vibe = target_user.vibe THEN
    score := score + 15;
  ELSIF (current_user.vibe IN ('deep', 'intellectual') AND target_user.vibe IN ('deep', 'intellectual')) OR
        (current_user.vibe IN ('light', 'funny') AND target_user.vibe IN ('light', 'funny')) OR
        (current_user.vibe IN ('chill', 'quiet') AND target_user.vibe IN ('chill', 'quiet')) THEN
    score := score + 10;
  END IF;
  
  -- 4. Life Phase Alignment (0-10 points)
  IF current_user.life_phase = target_user.life_phase THEN
    score := score + 10;
  ELSIF (current_user.life_phase IN ('student', 'career transition') AND target_user.life_phase IN ('student', 'career transition')) OR
        (current_user.life_phase IN ('new parent', 'settling down') AND target_user.life_phase IN ('new parent', 'settling down')) THEN
    score := score + 5;
  END IF;
  
  -- 5. Value Alignment Score (0-10 points)
  IF target_user.value_alignment_score IS NOT NULL AND current_user.value_alignment_score IS NOT NULL THEN
    score := score + LEAST(ABS(target_user.value_alignment_score - current_user.value_alignment_score), 10);
  END IF;
  
  -- 6. Timezone Overlap Score (0-10 points)
  IF target_user.timezone_overlap_score IS NOT NULL AND current_user.timezone_overlap_score IS NOT NULL THEN
    score := score + LEAST(ABS(target_user.timezone_overlap_score - current_user.timezone_overlap_score), 10);
  END IF;
  
  -- 7. Communication Style Compatibility (0-10 points)
  SELECT cardinality(current_user.communication_style & target_user.communication_style) INTO shared_communication_count;
  score := score + LEAST(shared_communication_count * 3, 10);
  
  -- 8. Regional Connection (0-5 points)
  IF current_user.region_preference IS NOT NULL AND target_user.region_preference IS NOT NULL THEN
    SELECT cardinality(current_user.region_preference & target_user.region_preference) INTO shared_regions_count;
    score := score + LEAST(shared_regions_count * 2, 5);
  END IF;
  
  -- 9. Emotional Availability Bonus/Penalty (0-5 points)
  IF current_user.emotional_availability = 'open' AND target_user.emotional_availability = 'open' THEN
    score := score + 5;
  ELSIF current_user.emotional_availability = 'healing' AND target_user.emotional_availability = 'healing' THEN
    score := score + 3;
  ELSIF current_user.emotional_availability = 'guarded' AND target_user.emotional_availability = 'guarded' THEN
    score := score + 2;
  END IF;
  
  -- Ensure score is within bounds
  RETURN GREATEST(0, LEAST(score, 100));
END;
$$;

-- Create or replace the match label function
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

-- Create or replace the main matching function
CREATE OR REPLACE FUNCTION find_potential_matches(current_user_id UUID, match_limit INTEGER DEFAULT 10)
RETURNS TABLE (
  user_id UUID,
  full_name TEXT,
  bio TEXT,
  profile_picture_url TEXT,
  interests TEXT[],
  intentions TEXT[],
  vibe TEXT,
  life_phase TEXT,
  communication_style TEXT[],
  emotional_availability TEXT,
  location TEXT,
  match_score INTEGER,
  match_label TEXT,
  shared_interests TEXT[],
  shared_intentions TEXT[]
)
LANGUAGE plpgsql
AS $$
DECLARE
  current_user profiles%ROWTYPE;
BEGIN
  -- Get current user data
  SELECT * INTO current_user FROM profiles WHERE id = current_user_id;
  
  -- Return potential matches
  RETURN QUERY
  SELECT 
    p.id as user_id,
    p.full_name,
    p.bio,
    p.profile_picture_url,
    p.interests,
    p.intentions,
    p.vibe,
    p.life_phase,
    p.communication_style,
    p.emotional_availability,
    p.location,
    calculate_match_score(current_user_id, p.id) as match_score,
    get_match_label(calculate_match_score(current_user_id, p.id)) as match_label,
    (current_user.interests & p.interests) as shared_interests,
    (current_user.intentions & p.intentions) as shared_intentions
  FROM profiles p
  WHERE p.id != current_user_id  -- Exclude self
    AND p.is_active = true
    AND p.is_profile_complete = true
    AND p.id NOT IN (
      -- Exclude users already interacted with
      SELECT ui.target_user_id 
      FROM user_interactions ui 
      WHERE ui.user_id = current_user_id
    )
    AND (
      -- Must have at least one shared intention
      cardinality(current_user.intentions & p.intentions) > 0
    )
  ORDER BY 
    calculate_match_score(current_user_id, p.id) DESC,
    p.value_alignment_score DESC,
    p.timezone_overlap_score DESC,
    p.last_active DESC
  LIMIT match_limit;
END;
$$;

-- Create or replace the mutual matches function
CREATE OR REPLACE FUNCTION find_mutual_matches(current_user_id UUID)
RETURNS TABLE (
  match_id UUID,
  matched_user_id UUID,
  full_name TEXT,
  profile_picture_url TEXT,
  bio TEXT,
  match_score INTEGER,
  match_label TEXT,
  matched_at TIMESTAMP WITH TIME ZONE,
  last_message_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    m.id as match_id,
    CASE 
      WHEN m.user1_id = current_user_id THEN m.user2_id
      ELSE m.user1_id
    END as matched_user_id,
    p.full_name,
    p.profile_picture_url,
    p.bio,
    calculate_match_score(current_user_id, 
      CASE 
        WHEN m.user1_id = current_user_id THEN m.user2_id
        ELSE m.user1_id
      END
    ) as match_score,
    get_match_label(calculate_match_score(current_user_id, 
      CASE 
        WHEN m.user1_id = current_user_id THEN m.user2_id
        ELSE m.user1_id
      END
    )) as match_label,
    m.created_at as matched_at,
    (
      SELECT MAX(msg.created_at)
      FROM messages msg
      WHERE (msg.sender_id = current_user_id AND msg.receiver_id = (CASE WHEN m.user1_id = current_user_id THEN m.user2_id ELSE m.user1_id END))
         OR (msg.receiver_id = current_user_id AND msg.sender_id = (CASE WHEN m.user1_id = current_user_id THEN m.user2_id ELSE m.user1_id END))
    ) as last_message_at
  FROM matches m
  JOIN profiles p ON p.id = CASE 
    WHEN m.user1_id = current_user_id THEN m.user2_id
    ELSE m.user1_id
  END
  WHERE (m.user1_id = current_user_id OR m.user2_id = current_user_id)
    AND m.is_active = true
    AND p.is_active = true
  ORDER BY 
    last_message_at DESC NULLS LAST,
    match_score DESC,
    m.created_at DESC;
END;
$$;

-- Create or replace the matching options function
CREATE OR REPLACE FUNCTION get_matching_options()
RETURNS JSON
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN json_build_object(
    'intentions', ARRAY['friendship', 'dating', 'networking', 'cultural_exchange', 'mentorship', 'business_partnership', 'travel_buddy', 'activity_partner'],
    'vibes', ARRAY['deep', 'light', 'funny', 'quiet', 'adventurous', 'chill', 'intellectual', 'spiritual'],
    'life_phases', ARRAY['student', 'new parent', 'relocating', 'hustle season', 'career transition', 'settling down', 'exploring', 'established'],
    'communication_styles', ARRAY['text', 'voice', 'memes', 'long_chats', 'video_calls', 'voice_notes', 'emojis', 'formal'],
    'emotional_availability', ARRAY['guarded', 'open', 'healing', 'selective', 'ready'],
    'regions', ARRAY['north_america', 'europe', 'middle_east', 'australia', 'asia', 'africa', 'south_america']
  );
END;
$$;

-- =====================================================
-- 3. ENABLE REALTIME SUBSCRIPTIONS
-- =====================================================

-- Enable realtime for enhanced matching
ALTER PUBLICATION supabase_realtime ADD TABLE profiles;

-- =====================================================
-- 4. SET DEFAULT VALUES FOR EXISTING USERS
-- =====================================================

-- Update existing users with default enhanced matching values
UPDATE profiles 
SET 
  intentions = ARRAY['friendship', 'dating'],
  vibe = 'light',
  life_phase = 'exploring',
  timezone_overlap_score = 5,
  value_alignment_score = 5,
  communication_style = ARRAY['text', 'voice'],
  emotional_availability = 'open'
WHERE (intentions IS NULL OR cardinality(intentions) = 0)
  AND is_active = true;

-- =====================================================
-- SETUP COMPLETE
-- =====================================================

SELECT 'Enhanced matching system setup completed successfully! 🚀' as status;
