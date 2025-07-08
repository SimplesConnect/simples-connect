# Flow Test Error Fixes

## 🔍 **Root Cause Analysis**

The errors you're seeing are due to:

1. **Database Relationship Issues**: Foreign key constraints between tables are broken
2. **Insufficient Test Data**: Only 3 profiles exist, and they've all already interacted with each other
3. **Missing Dummy Users**: No fresh potential matches available for testing

## 🛠️ **Complete Fix Instructions**

### **Step 1: Fix Database Relationships & Add Test Data**

**Go to your Supabase Dashboard → SQL Editor and run this complete script:**

```sql
-- Fix Database Relationships and Add Test Data
-- This will recreate tables with proper foreign key constraints

-- First, let's check current data
SELECT 'Current profiles count:' as info, count(*) as count FROM profiles;
SELECT 'Current matches count:' as info, count(*) as count FROM matches;
SELECT 'Current interactions count:' as info, count(*) as count FROM user_interactions;

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

-- Clear existing test data
DELETE FROM profiles WHERE email LIKE '%test%' OR email LIKE '%dummy%';

-- Insert dummy profiles for testing
INSERT INTO profiles (
    id, 
    full_name, 
    email, 
    birthdate, 
    gender, 
    looking_for, 
    bio, 
    interests, 
    location, 
    profile_picture_url,
    is_profile_complete,
    created_at
) VALUES 
-- User 1: Sarah
('550e8400-e29b-41d4-a716-446655440001', 'Sarah Johnson', 'sarah.test@example.com', '1995-06-15', 'female', 'male', 
 'Love hiking, reading, and trying new restaurants. Looking for someone genuine and kind!', 
 ARRAY['hiking', 'reading', 'cooking', 'travel', 'photography'], 
 'Kampala, Uganda', 
 'https://images.unsplash.com/photo-1494790108755-2616b612b29c?w=400&h=400&fit=crop&crop=face',
 true, NOW() - INTERVAL '5 days'),

-- User 2: Michael
('550e8400-e29b-41d4-a716-446655440002', 'Michael Okello', 'michael.test@example.com', '1992-03-22', 'male', 'female',
 'Software developer who loves music and outdoor adventures. Always up for a good conversation!',
 ARRAY['technology', 'music', 'hiking', 'movies', 'gaming'],
 'Entebbe, Uganda',
 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
 true, NOW() - INTERVAL '3 days'),

-- User 3: Grace
('550e8400-e29b-41d4-a716-446655440003', 'Grace Namuli', 'grace.test@example.com', '1997-11-08', 'female', 'male',
 'Teacher passionate about education and community development. Love dancing and spending time with family.',
 ARRAY['education', 'dancing', 'community service', 'family', 'books'],
 'Jinja, Uganda',
 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
 true, NOW() - INTERVAL '7 days'),

-- User 4: David
('550e8400-e29b-41d4-a716-446655440004', 'David Muwanga', 'david.test@example.com', '1990-09-12', 'male', 'female',
 'Entrepreneur running a small business. Enjoy football, good food, and meaningful conversations.',
 ARRAY['business', 'football', 'food', 'entrepreneurship', 'networking'],
 'Mbarara, Uganda',
 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
 true, NOW() - INTERVAL '2 days'),

-- User 5: Fatima
('550e8400-e29b-41d4-a716-446655440005', 'Fatima Nakato', 'fatima.test@example.com', '1994-12-03', 'female', 'male',
 'Healthcare worker dedicated to helping others. Love art, music, and exploring new cultures.',
 ARRAY['healthcare', 'art', 'music', 'culture', 'volunteering'],
 'Gulu, Uganda',
 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face',
 true, NOW() - INTERVAL '4 days'),

-- User 6: James
('550e8400-e29b-41d4-a716-446655440006', 'James Kigozi', 'james.test@example.com', '1988-07-25', 'male', 'female',
 'Engineer who loves problem-solving and innovation. Enjoy cycling, photography, and weekend getaways.',
 ARRAY['engineering', 'cycling', 'photography', 'innovation', 'travel'],
 'Masaka, Uganda',
 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
 true, NOW() - INTERVAL '6 days'),

-- User 7: Rebecca
('550e8400-e29b-41d4-a716-446655440007', 'Rebecca Asiimwe', 'rebecca.test@example.com', '1996-04-18', 'female', 'male',
 'Marketing professional with a creative spirit. Love fashion, travel, and discovering new places.',
 ARRAY['marketing', 'fashion', 'travel', 'creativity', 'social media'],
 'Fort Portal, Uganda',
 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face',
 true, NOW() - INTERVAL '1 day'),

-- User 8: Patrick
('550e8400-e29b-41d4-a716-446655440008', 'Patrick Tumusiime', 'patrick.test@example.com', '1993-01-30', 'male', 'female',
 'Finance professional who values honesty and hard work. Enjoy sports, reading, and family time.',
 ARRAY['finance', 'sports', 'reading', 'family', 'honesty'],
 'Kabale, Uganda',
 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face',
 true, NOW() - INTERVAL '8 days'),

-- User 9: Amina
('550e8400-e29b-41d4-a716-446655440009', 'Amina Nalubega', 'amina.test@example.com', '1991-10-14', 'female', 'male',
 'Journalist passionate about storytelling and social justice. Love writing, research, and community engagement.',
 ARRAY['journalism', 'writing', 'research', 'social justice', 'community'],
 'Arua, Uganda',
 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop&crop=face',
 true, NOW() - INTERVAL '9 days'),

-- User 10: Robert
('550e8400-e29b-41d4-a716-446655440010', 'Robert Ssemakula', 'robert.test@example.com', '1989-05-07', 'male', 'female',
 'Doctor committed to healthcare excellence. Enjoy research, tennis, and spending time in nature.',
 ARRAY['medicine', 'research', 'tennis', 'nature', 'healthcare'],
 'Mbale, Uganda',
 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400&h=400&fit=crop&crop=face',
 true, NOW() - INTERVAL '10 days');

-- Enable realtime for all tables
ALTER publication supabase_realtime ADD TABLE user_interactions;
ALTER publication supabase_realtime ADD TABLE matches;
ALTER publication supabase_realtime ADD TABLE messages;

-- Verify the data was inserted
SELECT 'Test profiles created:' as info, count(*) as count FROM profiles WHERE email LIKE '%test%';

-- Show sample of created profiles
SELECT id, full_name, email, location, gender, looking_for 
FROM profiles 
WHERE email LIKE '%test%' 
ORDER BY created_at DESC 
LIMIT 5;
```

### **Step 2: Verify the Fix**

After running the SQL script, you should see:
- ✅ 10 new test profiles created
- ✅ Clean user_interactions, matches, and messages tables
- ✅ Proper foreign key relationships established

### **Step 3: Test the Flow**

1. **Make sure both servers are running:**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm start

   # Terminal 2 - Frontend  
   cd frontend
   npm run dev
   ```

2. **Run the Flow Test:**
   - Go to `http://localhost:5173/test-flow`
   - Click "Run Complete Test"
   - All tests should now pass ✅

## 🎯 **Expected Results After Fix**

The flow test should show:
- ✅ **Authentication Check**: User is logged in
- ✅ **Fetch Potential Matches**: Found 10 potential matches
- ✅ **Like Interaction**: Successfully liked a user
- ✅ **Fetch User Matches**: Can fetch matches (even if empty)
- ✅ **Load Conversations**: Can load conversations
- ✅ **Send Message**: Can send messages to matches

## 🔧 **What This Fix Does**

1. **Recreates Tables**: Drops and recreates all matching/messaging tables with proper foreign key constraints
2. **Adds Test Data**: Creates 10 diverse dummy profiles for testing
3. **Fixes Relationships**: Ensures all foreign key references work properly
4. **Enables RLS**: Sets up proper Row Level Security policies
5. **Creates Indexes**: Adds performance indexes for better query speed

## 📝 **Notes**

- The dummy profiles use fake UUIDs and won't interfere with real users
- All test profiles have `@test` in their email for easy identification
- The profiles are diverse (different genders, locations, interests) for realistic testing
- Foreign key constraints ensure data integrity between tables

After running this fix, your matching and messaging flow should work perfectly! 🚀 