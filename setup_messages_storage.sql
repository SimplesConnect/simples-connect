-- Setup for message image storage
-- This ensures the profiles bucket can store message images

-- The profiles bucket should already exist, but let's make sure
INSERT INTO storage.buckets (id, name, public) 
VALUES ('profiles', 'profiles', true) 
ON CONFLICT (id) DO NOTHING;

-- Add policy for message images (if not already exists)
-- Allow authenticated users to upload message images
CREATE POLICY IF NOT EXISTS "Allow message image uploads" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'profiles' AND 
  auth.role() = 'authenticated' AND
  (storage.foldername(name))[1] = 'messages'
);

-- Allow users to view message images
CREATE POLICY IF NOT EXISTS "Allow message image viewing" ON storage.objects
FOR SELECT USING (
  bucket_id = 'profiles' AND
  (storage.foldername(name))[1] = 'messages'
);

-- Allow users to delete their own message images
CREATE POLICY IF NOT EXISTS "Allow users to delete own message images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'profiles' AND 
  auth.uid()::text = (storage.foldername(name))[2] AND
  (storage.foldername(name))[1] = 'messages'
);

-- Verify storage setup
SELECT name, public FROM storage.buckets WHERE id = 'profiles'; 