-- Add gallery columns to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS gallery_images TEXT[];
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS gallery_video TEXT;

-- Update existing profiles to have empty arrays for gallery_images
UPDATE profiles SET gallery_images = '{}' WHERE gallery_images IS NULL;

-- Verify the columns were added
\d profiles; 