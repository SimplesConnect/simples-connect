-- Create a test match for messaging functionality
-- This will create mutual likes between two users, resulting in a match

-- Get the first two users
WITH user_pairs AS (
  SELECT 
    p1.id as user1_id,
    p2.id as user2_id,
    p1.full_name as user1_name,
    p2.full_name as user2_name
  FROM profiles p1
  CROSS JOIN profiles p2
  WHERE p1.id != p2.id
    AND p1.is_profile_complete = true
    AND p2.is_profile_complete = true
    AND (
      (p1.gender = 'man' AND p1.looking_for = 'women' AND p2.gender = 'woman' AND p2.looking_for = 'men')
      OR 
      (p1.gender = 'woman' AND p1.looking_for = 'men' AND p2.gender = 'man' AND p2.looking_for = 'women')
    )
  LIMIT 1
)
-- Create mutual interactions (both users like each other)
INSERT INTO user_interactions (user_id, target_user_id, interaction_type)
SELECT user1_id, user2_id, 'like' FROM user_pairs
UNION ALL
SELECT user2_id, user1_id, 'like' FROM user_pairs
ON CONFLICT (user_id, target_user_id) DO NOTHING;

-- Create the match
WITH user_pairs AS (
  SELECT 
    p1.id as user1_id,
    p2.id as user2_id
  FROM profiles p1
  CROSS JOIN profiles p2
  WHERE p1.id != p2.id
    AND p1.is_profile_complete = true
    AND p2.is_profile_complete = true
    AND (
      (p1.gender = 'man' AND p1.looking_for = 'women' AND p2.gender = 'woman' AND p2.looking_for = 'men')
      OR 
      (p1.gender = 'woman' AND p1.looking_for = 'men' AND p2.gender = 'man' AND p2.looking_for = 'women')
    )
  LIMIT 1
)
INSERT INTO matches (user1_id, user2_id)
SELECT 
  CASE WHEN user1_id < user2_id THEN user1_id ELSE user2_id END,
  CASE WHEN user1_id < user2_id THEN user2_id ELSE user1_id END
FROM user_pairs
ON CONFLICT (user1_id, user2_id) DO NOTHING;

-- Verify the match was created
SELECT 
  'Match created between:' as info,
  p1.full_name as user1,
  p2.full_name as user2,
  m.created_at
FROM matches m
JOIN profiles p1 ON m.user1_id = p1.id
JOIN profiles p2 ON m.user2_id = p2.id
ORDER BY m.created_at DESC
LIMIT 1; 