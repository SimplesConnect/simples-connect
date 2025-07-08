-- Complete database setup for Simples Connect
-- This file ensures all required columns exist and sets up storage policies

-- Add missing columns to profiles table (if they don't exist)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS birthdate DATE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS interests TEXT[];
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_profile_complete BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS looking_for TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS gallery_images TEXT[];
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS gallery_video TEXT;

-- Update existing profiles to have proper default values
UPDATE profiles SET 
  interests = '{}' WHERE interests IS NULL,
  gallery_images = '{}' WHERE gallery_images IS NULL,
  is_profile_complete = FALSE WHERE is_profile_complete IS NULL;

-- Create storage bucket for profiles (if it doesn't exist)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('profiles', 'profiles', true) 
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Allow authenticated users to upload files" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to update own files" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to delete own files" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read access" ON storage.objects;

-- Storage policies for profiles bucket
-- Allow authenticated users to upload files
CREATE POLICY "Allow authenticated users to upload files" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'profiles' AND 
  auth.role() = 'authenticated'
);

-- Allow users to update their own files
CREATE POLICY "Allow users to update own files" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'profiles' AND 
  auth.uid()::text = (storage.foldername(name))[1]
) WITH CHECK (
  bucket_id = 'profiles' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own files
CREATE POLICY "Allow users to delete own files" ON storage.objects
FOR DELETE USING (
  bucket_id = 'profiles' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow public read access to all profile files
CREATE POLICY "Allow public read access" ON storage.objects
FOR SELECT USING (bucket_id = 'profiles');

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Verify the setup
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
ORDER BY ordinal_position; 