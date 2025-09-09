-- Test Script to Verify Matching Algorithm Fix
-- Run this AFTER applying the fix_matching_trigger.sql

-- 1. Check current database state
SELECT 'Current profiles count:' as info, COUNT(*) as count FROM profiles WHERE is_profile_complete = true;
SELECT 'Current matches count:' as info, COUNT(*) as count FROM matches;
SELECT 'Current interactions count:' as info, COUNT(*) as count FROM user_interactions;

-- 2. Get two test user IDs from existing profiles
SELECT 'Available test users:' as info;
SELECT id, full_name, email 
FROM profiles 
WHERE is_profile_complete = true 
ORDER BY created_at 
LIMIT 3;

-- 3. Test the matching flow with actual user IDs
-- Replace these with actual UUIDs from your profiles table
DO $$
DECLARE
    user1_id UUID;
    user2_id UUID;
    test_match_id UUID;
BEGIN
    -- Get two actual user IDs
    SELECT id INTO user1_id FROM profiles WHERE is_profile_complete = true ORDER BY created_at LIMIT 1;
    SELECT id INTO user2_id FROM profiles WHERE is_profile_complete = true ORDER BY created_at LIMIT 1 OFFSET 1;
    
    -- Only proceed if we have valid users
    IF user1_id IS NOT NULL AND user2_id IS NOT NULL AND user1_id != user2_id THEN
        RAISE NOTICE 'Testing with User 1: % and User 2: %', user1_id, user2_id;
        
        -- Step 1: User 1 likes User 2
        INSERT INTO user_interactions (user_id, target_user_id, interaction_type)
        VALUES (user1_id, user2_id, 'like')
        ON CONFLICT (user_id, target_user_id) DO NOTHING;
        
        RAISE NOTICE 'User 1 liked User 2';
        
        -- Step 2: User 2 likes User 1 (mutual like)
        INSERT INTO user_interactions (user_id, target_user_id, interaction_type)
        VALUES (user2_id, user1_id, 'like')
        ON CONFLICT (user_id, target_user_id) DO NOTHING;
        
        RAISE NOTICE 'User 2 liked User 1 - mutual like created';
        
        -- Step 3: Create match (this should work now with the fixed trigger)
        INSERT INTO matches (user1_id, user2_id, is_active)
        VALUES (user1_id, user2_id, true)
        ON CONFLICT (user1_id, user2_id) DO NOTHING
        RETURNING id INTO test_match_id;
        
        IF test_match_id IS NOT NULL THEN
            RAISE NOTICE 'SUCCESS: Match created with ID: %', test_match_id;
        ELSE
            RAISE NOTICE 'INFO: Match already existed or trigger ensured consistency';
        END IF;
        
    ELSE
        RAISE NOTICE 'ERROR: Not enough test users found in profiles table';
    END IF;
END $$;

-- 4. Verify the results
SELECT 'Test Results:' as section;
SELECT 'Total matches after test:' as info, COUNT(*) as count FROM matches;

-- 5. Show the created match details
SELECT 'Created match details:' as info;
SELECT 
  m.id as match_id,
  m.created_at,
  u1.full_name as user1_name,
  u2.full_name as user2_name,
  m.is_active
FROM matches m
JOIN profiles u1 ON m.user1_id = u1.id
JOIN profiles u2 ON m.user2_id = u2.id
ORDER BY m.created_at DESC
LIMIT 1;

SELECT 'Test completed! If you see SUCCESS messages above, the matching system is working correctly.' as result;