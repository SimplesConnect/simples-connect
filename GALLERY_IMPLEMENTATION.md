# Gallery Feature Implementation

## Overview
The gallery feature allows users to upload up to 3 additional photos and 1 video to showcase more of themselves beyond their main profile picture.

## Database Changes
Two new columns have been added to the `profiles` table:
- `gallery_images` (TEXT[]): Array of image URLs
- `gallery_video` (TEXT): Single video URL

## Storage Structure
Files are stored in the Supabase `profiles` bucket:
- **Images**: `profiles/images/` folder
- **Videos**: `profiles/videos/` folder

## File Naming Convention
- **Images**: `{userId}-gallery-{timestamp}-{randomString}.{extension}`
- **Videos**: `{userId}-video-{timestamp}.{extension}`

## File Restrictions
### Images
- **Formats**: JPEG, PNG, WebP
- **Max Size**: 5MB per image
- **Max Count**: 3 images

### Videos
- **Formats**: MP4, WebM, OGG, MOV
- **Max Size**: 50MB
- **Max Count**: 1 video

## Features Implemented

### EditProfile Component
- Gallery upload UI with drag & drop
- Image preview with removal capability
- Video upload with preview
- File validation and error handling
- Automatic cleanup of old files when replacing
- Progress indicators during upload

### ViewProfile Component
- Gallery display section
- Image carousel for multiple photos
- Video player with controls
- Responsive design
- Fallback images for broken URLs

## Database Setup
Run one of these SQL files to set up the required database structure:

1. **Quick setup**: `add_gallery_columns.sql` - Just adds the gallery columns
2. **Complete setup**: `complete_database_setup.sql` - Full database setup with all columns and storage policies

## Storage Policies
The implementation includes proper RLS policies for:
- Authenticated users can upload files
- Users can only modify their own files
- Public read access for all profile media
- Automatic cleanup of old files

## Usage
1. Users can access the gallery section in their profile edit page
2. Upload up to 3 images by clicking the upload area or dragging files
3. Upload 1 video using the video upload section
4. Images and videos are automatically saved when the profile is saved
5. Gallery media is displayed on the user's profile page
6. Other users can view the gallery in a carousel format 