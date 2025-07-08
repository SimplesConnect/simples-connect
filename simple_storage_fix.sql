-- SIMPLE FIX: Completely disable RLS for profiles bucket
-- Run this in your Supabase SQL Editor for immediate fix

-- Make sure the profiles bucket exists and is public
INSERT INTO storage.buckets (id, name, public)
VALUES ('profiles', 'profiles', true)
ON CONFLICT (id) DO NOTHING;

-- Update bucket to be public (allows public read access to images)
UPDATE storage.buckets 
SET public = true 
WHERE id = 'profiles';

-- Create a permissive policy that allows all operations on the profiles bucket
-- This effectively disables RLS for this bucket while keeping it enabled elsewhere
CREATE POLICY "Allow all operations on profiles bucket" ON storage.objects
FOR ALL 
TO authenticated
USING (bucket_id = 'profiles')
WITH CHECK (bucket_id = 'profiles');

-- Alternative: If the above doesn't work, you can completely disable RLS
-- (Uncomment the line below if needed)
-- ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY; 