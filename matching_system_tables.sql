-- Create tables for the matching system
-- Run this in your Supabase SQL Editor

-- User interactions table (likes, passes)
CREATE TABLE IF NOT EXISTS user_interactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  target_user_id UUID NOT NULL,
  interaction_type VARCHAR(10) CHECK (interaction_type IN ('like', 'pass')) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, target_user_id)
);

-- Matches table (when two users like each other)
CREATE TABLE IF NOT EXISTS matches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user1_id UUID NOT NULL,
  user2_id UUID NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user1_id, user2_id)
);

-- Add foreign key constraints to profiles table if they don't exist
ALTER TABLE user_interactions 
ADD CONSTRAINT fk_user_interactions_user_id 
FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

ALTER TABLE user_interactions 
ADD CONSTRAINT fk_user_interactions_target_user_id 
FOREIGN KEY (target_user_id) REFERENCES profiles(id) ON DELETE CASCADE;

ALTER TABLE matches 
ADD CONSTRAINT fk_matches_user1_id 
FOREIGN KEY (user1_id) REFERENCES profiles(id) ON DELETE CASCADE;

ALTER TABLE matches 
ADD CONSTRAINT fk_matches_user2_id 
FOREIGN KEY (user2_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_interactions_user_id ON user_interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_interactions_target_user_id ON user_interactions(target_user_id);
CREATE INDEX IF NOT EXISTS idx_matches_user1_id ON matches(user1_id);
CREATE INDEX IF NOT EXISTS idx_matches_user2_id ON matches(user2_id);

-- Row Level Security policies
ALTER TABLE user_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

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