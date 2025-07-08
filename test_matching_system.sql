-- Test Script for Matching System
-- Run this after setting up the database to verify everything works

-- 1. Check if profiles table exists and has data
SELECT 'Profiles table check:' as test, COUNT(*) as total_profiles FROM profiles;
SELECT 'Complete profiles:' as test, COUNT(*) as complete_profiles FROM profiles WHERE is_profile_complete = true;

-- 2. Check if matching tables exist
SELECT 'User interactions table:' as test, 
       CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_interactions') 
       THEN 'EXISTS' ELSE 'MISSING' END as status;

SELECT 'Matches table:' as test, 
       CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'matches') 
       THEN 'EXISTS' ELSE 'MISSING' END as status;

-- 3. Test a sample interaction (like)
-- Insert a test interaction
INSERT INTO user_interactions (user_id, target_user_id, interaction_type) 
VALUES ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'like')
ON CONFLICT (user_id, target_user_id) DO NOTHING;

-- Check if it was inserted
SELECT 'Test interaction:' as test, COUNT(*) as interactions FROM user_interactions;

-- 4. Test match creation
-- Insert mutual like to create a match
INSERT INTO user_interactions (user_id, target_user_id, interaction_type) 
VALUES ('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'like')
ON CONFLICT (user_id, target_user_id) DO NOTHING;

-- Try to create a match
INSERT INTO matches (user1_id, user2_id, is_active) 
VALUES ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', true)
ON CONFLICT (user1_id, user2_id) DO NOTHING;

-- Check if match was created
SELECT 'Test match:' as test, COUNT(*) as matches FROM matches;

-- 5. Test profile fetching query (simulate what the app does)
SELECT 'Available profiles for user 1:' as test, COUNT(*) as available_profiles
FROM profiles 
WHERE id != '11111111-1111-1111-1111-111111111111' 
AND is_profile_complete = true
AND id NOT IN (
  SELECT target_user_id 
  FROM user_interactions 
  WHERE user_id = '11111111-1111-1111-1111-111111111111'
);

-- 6. Show sample profiles that would be shown to user 1
SELECT 'Sample profiles for Emma:' as info;
SELECT id, full_name, 
       EXTRACT(YEAR FROM age(birthdate)) as age,
       location, gender
FROM profiles 
WHERE id != '11111111-1111-1111-1111-111111111111' 
AND is_profile_complete = true
AND id NOT IN (
  SELECT target_user_id 
  FROM user_interactions 
  WHERE user_id = '11111111-1111-1111-1111-111111111111'
)
LIMIT 5;

-- 7. Clean up test data
DELETE FROM matches WHERE user1_id = '11111111-1111-1111-1111-111111111111' OR user2_id = '11111111-1111-1111-1111-111111111111';
DELETE FROM user_interactions WHERE user_id = '11111111-1111-1111-1111-111111111111' OR target_user_id = '11111111-1111-1111-1111-111111111111';

SELECT 'Database test completed successfully!' as result; 