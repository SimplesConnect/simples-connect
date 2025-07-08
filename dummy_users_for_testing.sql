-- Dummy Users for Testing Simples Connect Matching System
-- Run this in your Supabase SQL Editor to add test users

-- First, let's add some dummy user accounts to auth.users (you might need to do this through Supabase Auth)
-- For now, we'll create profiles assuming user IDs exist

-- Insert dummy profiles for testing
INSERT INTO profiles (
  id,
  full_name,
  birthdate,
  bio,
  profile_picture_url,
  interests,
  location,
  gender,
  looking_for,
  is_profile_complete
) VALUES
-- User 1: Emma
('11111111-1111-1111-1111-111111111111', 
 'Emma Johnson', 
 '1995-06-15', 
 'Adventure seeker and coffee enthusiast. Love hiking, photography, and trying new restaurants. Looking for someone to explore the city with!', 
 'https://images.unsplash.com/photo-1494790108755-2616b612b29c?w=400&h=400&fit=crop&crop=face',
 ARRAY['Hiking', 'Photography', 'Coffee', 'Travel', 'Yoga', 'Reading'],
 'San Francisco, CA',
 'female',
 'male',
 true),

-- User 2: Alex
('22222222-2222-2222-2222-222222222222',
 'Alex Rodriguez',
 '1992-03-22',
 'Tech enthusiast and fitness lover. Enjoy coding, rock climbing, and cooking. Always up for a good conversation about anything from startups to philosophy.',
 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
 ARRAY['Technology', 'Rock Climbing', 'Cooking', 'Fitness', 'Music', 'Entrepreneurship'],
 'San Francisco, CA',
 'male',
 'female',
 true),

-- User 3: Sophia
('33333333-3333-3333-3333-333333333333',
 'Sophia Chen',
 '1997-11-08',
 'Artist and dreamer. I paint, dance, and love exploring museums. Looking for someone creative who appreciates art and spontaneous adventures.',
 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
 ARRAY['Art', 'Dancing', 'Museums', 'Painting', 'Theater', 'Wine Tasting'],
 'Los Angeles, CA',
 'female',
 'male',
 true),

-- User 4: Marcus
('44444444-4444-4444-4444-444444444444',
 'Marcus Thompson',
 '1990-09-12',
 'Outdoor enthusiast and dog lover. Spend my weekends surfing, hiking, or at the dog park with my golden retriever. Love live music and good food.',
 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
 ARRAY['Surfing', 'Dogs', 'Live Music', 'Hiking', 'Craft Beer', 'BBQ'],
 'San Diego, CA',
 'male',
 'female',
 true),

-- User 5: Isabella
('55555555-5555-5555-5555-555555555555',
 'Isabella Martinez',
 '1994-12-03',
 'Foodie and travel blogger. Always planning my next adventure or trying a new recipe. Love languages, cultures, and meeting new people from around the world.',
 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face',
 ARRAY['Travel', 'Food', 'Languages', 'Writing', 'Photography', 'Cultures'],
 'Miami, FL',
 'female',
 'male',
 true),

-- User 6: David
('66666666-6666-6666-6666-666666666666',
 'David Kim',
 '1991-07-28',
 'Software engineer by day, musician by night. Play guitar in a local band and love discovering new music. Also into gaming, sci-fi movies, and good coffee.',
 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
 ARRAY['Music', 'Guitar', 'Gaming', 'Sci-Fi', 'Coffee', 'Programming'],
 'Seattle, WA',
 'male',
 'female',
 true),

-- User 7: Olivia
('77777777-7777-7777-7777-777777777777',
 'Olivia Brown',
 '1996-04-17',
 'Yoga instructor and wellness enthusiast. Passionate about mindfulness, healthy living, and helping others find their zen. Love nature walks and meditation.',
 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop&crop=face',
 ARRAY['Yoga', 'Meditation', 'Wellness', 'Nature', 'Healthy Cooking', 'Mindfulness'],
 'Austin, TX',
 'female',
 'male',
 true),

-- User 8: James
('88888888-8888-8888-8888-888888888888',
 'James Wilson',
 '1993-01-05',
 'Adventure photographer and world traveler. Been to 30+ countries and always planning the next trip. Love capturing moments and sharing stories over good wine.',
 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=face',
 ARRAY['Photography', 'Travel', 'Adventure', 'Wine', 'Storytelling', 'Backpacking'],
 'Denver, CO',
 'male',
 'female',
 true),

-- User 9: Ava
('99999999-9999-9999-9999-999999999999',
 'Ava Taylor',
 '1998-08-20',
 'Marine biology student with a passion for ocean conservation. Love scuba diving, beach volleyball, and anything related to marine life. Seeking someone who cares about our planet.',
 'https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?w=400&h=400&fit=crop&crop=face',
 ARRAY['Marine Biology', 'Scuba Diving', 'Beach Volleyball', 'Conservation', 'Ocean', 'Research'],
 'San Diego, CA',
 'female',
 'male',
 true),

-- User 10: Ryan
('10101010-1010-1010-1010-101010101010',
 'Ryan Davis',
 '1989-05-14',
 'Chef and food entrepreneur. Own a small restaurant and love experimenting with fusion cuisine. When not cooking, you can find me at farmers markets or trying new restaurants.',
 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face',
 ARRAY['Cooking', 'Restaurants', 'Food Innovation', 'Farmers Markets', 'Wine Pairing', 'Entrepreneurship'],
 'Portland, OR',
 'male',
 'female',
 true);

-- Add some gallery images for testing (optional)
UPDATE profiles SET gallery_images = ARRAY[
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop'
] WHERE id = '11111111-1111-1111-1111-111111111111';

UPDATE profiles SET gallery_images = ARRAY[
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop'
] WHERE id = '22222222-2222-2222-2222-222222222222';

-- Note: These are dummy UUIDs. In a real application, you would:
-- 1. Create actual user accounts through Supabase Auth
-- 2. Use the real user IDs from auth.users
-- 3. Ensure proper RLS policies are in place

-- For testing purposes, you may need to temporarily disable RLS or adjust policies:
-- ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
-- (Remember to re-enable after testing: ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;) 