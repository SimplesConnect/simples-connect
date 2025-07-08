-- Simples Connect Database Schema
-- This file contains the SQL statements to create all necessary tables for the real-time matching system

-- Enable RLS (Row Level Security) for all tables
-- This ensures users can only access their own data

-- 1. Profiles Table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  age INTEGER CHECK (age >= 18 AND age <= 100),
  bio TEXT,
  profile_picture_url TEXT,
  interests TEXT[], -- Array of interest strings
  location TEXT,
  gender TEXT CHECK (gender IN ('man', 'woman', 'non-binary', 'other')),
  looking_for TEXT CHECK (looking_for IN ('men', 'women', 'everyone')),
  is_profile_complete BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. User Interactions Table (likes, passes, super likes)
CREATE TABLE IF NOT EXISTS user_interactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  target_user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  interaction_type TEXT CHECK (interaction_type IN ('like', 'pass', 'super_like')) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, target_user_id) -- Prevent duplicate interactions
);

-- 3. Matches Table
CREATE TABLE IF NOT EXISTS matches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user1_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  user2_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  -- Ensure no duplicate matches and user1_id < user2_id for consistency
  CHECK (user1_id != user2_id),
  UNIQUE(user1_id, user2_id)
);

-- 4. Messages Table
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  match_id UUID REFERENCES matches(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  receiver_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'gif')),
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. User Settings Table
CREATE TABLE IF NOT EXISTS user_settings (
  id UUID REFERENCES profiles(id) ON DELETE CASCADE PRIMARY KEY,
  max_distance INTEGER DEFAULT 50, -- km
  min_age INTEGER DEFAULT 18,
  max_age INTEGER DEFAULT 35,
  show_me TEXT DEFAULT 'everyone' CHECK (show_me IN ('men', 'women', 'everyone')),
  notifications_enabled BOOLEAN DEFAULT TRUE,
  match_notifications BOOLEAN DEFAULT TRUE,
  message_notifications BOOLEAN DEFAULT TRUE,
  push_notifications BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Reports Table (for user safety)
CREATE TABLE IF NOT EXISTS reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reporter_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  reported_user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  reason TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_age ON profiles(age);
CREATE INDEX IF NOT EXISTS idx_profiles_location ON profiles(location);
CREATE INDEX IF NOT EXISTS idx_profiles_is_active ON profiles(is_active);
CREATE INDEX IF NOT EXISTS idx_profiles_last_active ON profiles(last_active);
CREATE INDEX IF NOT EXISTS idx_user_interactions_user_id ON user_interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_interactions_target_user_id ON user_interactions(target_user_id);
CREATE INDEX IF NOT EXISTS idx_user_interactions_created_at ON user_interactions(created_at);
CREATE INDEX IF NOT EXISTS idx_matches_user1_id ON matches(user1_id);
CREATE INDEX IF NOT EXISTS idx_matches_user2_id ON matches(user2_id);
CREATE INDEX IF NOT EXISTS idx_matches_is_active ON matches(is_active);
CREATE INDEX IF NOT EXISTS idx_messages_match_id ON messages(match_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);

-- Row Level Security (RLS) Policies

-- Profiles RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Users can view all active profiles (for matching)
CREATE POLICY "Users can view active profiles" ON profiles
  FOR SELECT USING (is_active = TRUE);

-- Users can only update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Users can only insert their own profile
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- User Interactions RLS
ALTER TABLE user_interactions ENABLE ROW LEVEL SECURITY;

-- Users can view interactions where they are involved
CREATE POLICY "Users can view own interactions" ON user_interactions
  FOR SELECT USING (auth.uid() = user_id OR auth.uid() = target_user_id);

-- Users can only create interactions from themselves
CREATE POLICY "Users can create own interactions" ON user_interactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Matches RLS
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

-- Users can view matches where they are involved
CREATE POLICY "Users can view own matches" ON matches
  FOR SELECT USING (auth.uid() = user1_id OR auth.uid() = user2_id);

-- Users can update matches where they are involved (for unmatching)
CREATE POLICY "Users can update own matches" ON matches
  FOR UPDATE USING (auth.uid() = user1_id OR auth.uid() = user2_id);

-- Messages RLS
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Users can view messages in their matches
CREATE POLICY "Users can view own messages" ON messages
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- Users can send messages in their matches
CREATE POLICY "Users can send messages" ON messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Users can update their own messages (mark as read, etc.)
CREATE POLICY "Users can update own messages" ON messages
  FOR UPDATE USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- User Settings RLS
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Users can only access their own settings
CREATE POLICY "Users can manage own settings" ON user_settings
  FOR ALL USING (auth.uid() = id);

-- Reports RLS
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Users can create reports
CREATE POLICY "Users can create reports" ON reports
  FOR INSERT WITH CHECK (auth.uid() = reporter_id);

-- Users can view their own reports
CREATE POLICY "Users can view own reports" ON reports
  FOR SELECT USING (auth.uid() = reporter_id);

-- Functions and Triggers

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON profiles 
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_matches_updated_at 
  BEFORE UPDATE ON matches 
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_messages_updated_at 
  BEFORE UPDATE ON messages 
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at 
  BEFORE UPDATE ON user_settings 
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Function to automatically create user settings when profile is created
CREATE OR REPLACE FUNCTION create_user_settings()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_settings (id) VALUES (NEW.id);
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to create user settings
CREATE TRIGGER create_user_settings_trigger
  AFTER INSERT ON profiles
  FOR EACH ROW EXECUTE PROCEDURE create_user_settings();

-- Function to ensure match consistency (user1_id < user2_id)
CREATE OR REPLACE FUNCTION ensure_match_consistency()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.user1_id > NEW.user2_id THEN
    -- Swap the user IDs to maintain consistency
    NEW.user1_id := NEW.user2_id;
    NEW.user2_id := OLD.user1_id;
  END IF;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for match consistency
CREATE TRIGGER ensure_match_consistency_trigger
  BEFORE INSERT OR UPDATE ON matches
  FOR EACH ROW EXECUTE PROCEDURE ensure_match_consistency();

-- Real-time subscriptions setup
-- Enable real-time for tables that need live updates
ALTER PUBLICATION supabase_realtime ADD TABLE matches;
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE user_interactions;

-- Initial data for testing (optional)
-- You can uncomment these to add some test data

/*
-- Insert test profiles (make sure to replace with actual user IDs from auth.users)
INSERT INTO profiles (id, full_name, email, age, bio, interests, location, gender, looking_for, is_profile_complete) VALUES
('00000000-0000-0000-0000-000000000001', 'Sarah Nalukenge', 'sarah@example.com', 28, 'Love exploring Kampala, trying new restaurants, and dancing to Afrobeat music!', ARRAY['Dancing', 'Food', 'Music', 'Travel'], 'Kampala, Uganda', 'woman', 'men', TRUE),
('00000000-0000-0000-0000-000000000002', 'David Mukasa', 'david@example.com', 31, 'Software engineer who loves hiking, reading, and good coffee. Looking for someone to explore life with!', ARRAY['Technology', 'Hiking', 'Reading', 'Coffee'], 'Entebbe, Uganda', 'man', 'women', TRUE),
('00000000-0000-0000-0000-000000000003', 'Grace Akello', 'grace@example.com', 26, 'Artist and photographer capturing the beauty of Uganda. Love nature, art, and meaningful conversations.', ARRAY['Art', 'Photography', 'Nature', 'Travel'], 'Jinja, Uganda', 'woman', 'everyone', TRUE);
*/

-- Performance optimization views (optional)

-- View for active users with complete profiles
CREATE OR REPLACE VIEW active_complete_profiles AS
SELECT 
  id, full_name, age, bio, profile_picture_url, 
  interests, location, gender, looking_for, last_active
FROM profiles 
WHERE is_active = TRUE AND is_profile_complete = TRUE;

-- View for match statistics
CREATE OR REPLACE VIEW user_match_stats AS
SELECT 
  p.id,
  p.full_name,
  COUNT(DISTINCT CASE WHEN ui.interaction_type = 'like' THEN ui.target_user_id END) as likes_given,
  COUNT(DISTINCT CASE WHEN ui2.interaction_type = 'like' THEN ui2.user_id END) as likes_received,
  COUNT(DISTINCT m.id) as total_matches
FROM profiles p
LEFT JOIN user_interactions ui ON p.id = ui.user_id
LEFT JOIN user_interactions ui2 ON p.id = ui2.target_user_id
LEFT JOIN matches m ON (p.id = m.user1_id OR p.id = m.user2_id) AND m.is_active = TRUE
GROUP BY p.id, p.full_name; 