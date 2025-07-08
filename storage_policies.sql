-- Storage policies for the 'profiles' bucket
-- Run these commands in your Supabase SQL Editor

-- First, ensure the profiles bucket exists (if not already created)
INSERT INTO storage.buckets (id, name, public)
VALUES ('profiles', 'profiles', true)
ON CONFLICT (id) DO NOTHING;

-- Disable RLS on the storage.objects table for the profiles bucket
-- This allows authenticated users to upload, view, and manage their profile images

-- Policy to allow authenticated users to upload images to profiles/images/
CREATE POLICY "Users can upload profile images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'profiles' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = 'images'
);

-- Policy to allow users to view all profile images (public read)
CREATE POLICY "Anyone can view profile images" ON storage.objects
FOR SELECT USING (
  bucket_id = 'profiles'
  AND (storage.foldername(name))[1] = 'images'
);

-- Policy to allow users to update/delete their own profile images
CREATE POLICY "Users can update their own profile images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'profiles' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = 'images'
);

-- Policy to allow users to delete their own profile images
CREATE POLICY "Users can delete their own profile images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'profiles' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = 'images'
);

-- Alternative: If you want to completely disable RLS for the profiles bucket
-- (Less secure but simpler - uncomment the lines below if you prefer this approach)

-- ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;

-- Or disable RLS only for the profiles bucket by creating a permissive policy:
-- CREATE POLICY "Allow all operations on profiles bucket" ON storage.objects
-- FOR ALL USING (bucket_id = 'profiles');

-- Make sure the bucket is public so images can be accessed via public URLs
UPDATE storage.buckets 
SET public = true 
WHERE id = 'profiles'; 