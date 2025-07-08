-- Fix Messages Table for Simples Connect
-- Run this in your Supabase SQL Editor

-- Create messages table if it doesn't exist
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  match_id UUID NOT NULL,
  sender_id UUID NOT NULL,
  receiver_id UUID NOT NULL,
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image')),
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add foreign key constraints if they don't exist
DO $$ 
BEGIN
  -- Add foreign key constraint for match_id if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_messages_match_id'
  ) THEN
    ALTER TABLE messages 
    ADD CONSTRAINT fk_messages_match_id 
    FOREIGN KEY (match_id) REFERENCES matches(id) ON DELETE CASCADE;
  END IF;

  -- Add foreign key constraint for sender_id if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_messages_sender_id'
  ) THEN
    ALTER TABLE messages 
    ADD CONSTRAINT fk_messages_sender_id 
    FOREIGN KEY (sender_id) REFERENCES profiles(id) ON DELETE CASCADE;
  END IF;

  -- Add foreign key constraint for receiver_id if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_messages_receiver_id'
  ) THEN
    ALTER TABLE messages 
    ADD CONSTRAINT fk_messages_receiver_id 
    FOREIGN KEY (receiver_id) REFERENCES profiles(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_messages_match_id ON messages(match_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);

-- Enable Row Level Security
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own messages" ON messages;
DROP POLICY IF EXISTS "Users can send messages" ON messages;
DROP POLICY IF EXISTS "Users can update own messages" ON messages;

-- Create RLS policies
-- Users can view messages in their matches
CREATE POLICY "Users can view own messages" ON messages
  FOR SELECT USING (
    auth.uid() = sender_id OR 
    auth.uid() = receiver_id
  );

-- Users can send messages in their matches
CREATE POLICY "Users can send messages" ON messages
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM matches 
      WHERE matches.id = match_id 
      AND (matches.user1_id = auth.uid() OR matches.user2_id = auth.uid())
      AND matches.is_active = true
    )
  );

-- Users can update their own messages (mark as read, etc.)
CREATE POLICY "Users can update own messages" ON messages
  FOR UPDATE USING (
    auth.uid() = sender_id OR 
    auth.uid() = receiver_id
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_messages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at (drop first if exists)
DROP TRIGGER IF EXISTS update_messages_updated_at_trigger ON messages;
CREATE TRIGGER update_messages_updated_at_trigger
  BEFORE UPDATE ON messages
  FOR EACH ROW EXECUTE PROCEDURE update_messages_updated_at();

-- Enable real-time subscriptions for messages
ALTER PUBLICATION supabase_realtime ADD TABLE messages;

-- Test the setup
SELECT 
  'Messages table setup complete!' as status,
  COUNT(*) as message_count
FROM messages; 