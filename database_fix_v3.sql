-- Fix Database Relationships and Add Test Data (Version 3)
-- This version works with existing auth.users foreign key constraints

-- First, let's check current data
SELECT 'Current profiles count:' as info, count(*) as count FROM profiles;
SELECT 'Current matches count:' as info, count(*) as count FROM matches;
SELECT 'Current interactions count:' as info, count(*) as count FROM user_interactions;

-- Check existing user IDs to see what we can work with
SELECT 'Existing profile IDs:' as info, id, full_name, email, gender, looking_for 
FROM profiles 
WHERE is_profile_complete = true 
LIMIT 10;

-- Drop existing foreign key constraints if they exist
ALTER TABLE IF EXISTS matches DROP CONSTRAINT IF EXISTS matches_user1_id_fkey;
ALTER TABLE IF EXISTS matches DROP CONSTRAINT IF EXISTS matches_user2_id_fkey;
ALTER TABLE IF EXISTS user_interactions DROP CONSTRAINT IF EXISTS user_interactions_user_id_fkey;
ALTER TABLE IF EXISTS user_interactions DROP CONSTRAINT IF EXISTS user_interactions_target_user_id_fkey;
ALTER TABLE IF EXISTS messages DROP CONSTRAINT IF EXISTS messages_sender_id_fkey;
ALTER TABLE IF EXISTS messages DROP CONSTRAINT IF EXISTS messages_receiver_id_fkey;

-- Recreate tables with proper constraints
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS matches CASCADE;
DROP TABLE IF EXISTS user_interactions CASCADE;

-- Recreate user_interactions table
CREATE TABLE user_interactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    target_user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    interaction_type VARCHAR(10) NOT NULL CHECK (interaction_type IN ('like', 'pass')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, target_user_id)
);

-- Recreate matches table
CREATE TABLE matches (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user1_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    user2_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,
    UNIQUE(user1_id, user2_id),
    CHECK (user1_id != user2_id)
);

-- Recreate messages table
CREATE TABLE messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    message_type VARCHAR(20) DEFAULT 'text' CHECK (message_type IN ('text', 'image')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_read BOOLEAN DEFAULT false
);

-- Create indexes for performance
CREATE INDEX idx_user_interactions_user_id ON user_interactions(user_id);
CREATE INDEX idx_user_interactions_target_user_id ON user_interactions(target_user_id);
CREATE INDEX idx_user_interactions_type ON user_interactions(interaction_type);
CREATE INDEX idx_matches_user1_id ON matches(user1_id);
CREATE INDEX idx_matches_user2_id ON matches(user2_id);
CREATE INDEX idx_matches_active ON matches(is_active);
CREATE INDEX idx_messages_match_id ON messages(match_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);

-- Enable Row Level Security
ALTER TABLE user_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_interactions
CREATE POLICY "Users can view their own interactions" ON user_interactions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own interactions" ON user_interactions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for matches
CREATE POLICY "Users can view their matches" ON matches
    FOR SELECT USING (auth.uid() = user1_id OR auth.uid() = user2_id);

CREATE POLICY "System can create matches" ON matches
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their matches" ON matches
    FOR UPDATE USING (auth.uid() = user1_id OR auth.uid() = user2_id);

-- Create RLS policies for messages
CREATE POLICY "Users can view their messages" ON messages
    FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send messages" ON messages
    FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update their messages" ON messages
    FOR UPDATE USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- Clear existing interactions to reset the system
DELETE FROM user_interactions;

-- Enable realtime for all tables
ALTER publication supabase_realtime ADD TABLE user_interactions;
ALTER publication supabase_realtime ADD TABLE matches;
ALTER publication supabase_realtime ADD TABLE messages;

-- Show final status
SELECT 'Final status - Profiles:' as info, count(*) as count FROM profiles WHERE is_profile_complete = true;
SELECT 'Final status - Interactions:' as info, count(*) as count FROM user_interactions;
SELECT 'Final status - Matches:' as info, count(*) as count FROM matches;
SELECT 'Final status - Messages:' as info, count(*) as count FROM messages;

-- Show available profiles for testing
SELECT 'Available profiles for testing:' as info, id, full_name, email, gender, looking_for 
FROM profiles 
WHERE is_profile_complete = true 
ORDER BY created_at DESC; 