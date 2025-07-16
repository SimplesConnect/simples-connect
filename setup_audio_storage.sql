-- Setup Audio Storage for Vibes + Music Feature
-- This script creates storage buckets, tables, and policies for audio file management

-- Create storage bucket for audio files
INSERT INTO storage.buckets (id, name, public)
VALUES ('audio-files', 'audio-files', true)
ON CONFLICT (id) DO NOTHING;

-- Create audio_tracks table
CREATE TABLE IF NOT EXISTS audio_tracks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    artist_name VARCHAR(255) NOT NULL,
    album_name VARCHAR(255),
    genre VARCHAR(100),
    duration INTEGER, -- Duration in seconds
    file_url TEXT NOT NULL, -- URL to the audio file in storage
    cover_image_url TEXT,
    description TEXT,
    tags TEXT[], -- Array of tags like ['love', 'romantic', 'ugandan']
    upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    uploaded_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    is_featured BOOLEAN DEFAULT FALSE,
    is_approved BOOLEAN DEFAULT FALSE, -- For moderation
    play_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    file_size BIGINT, -- File size in bytes
    bitrate INTEGER, -- Audio bitrate
    format VARCHAR(10) DEFAULT 'mp3', -- Audio format (mp3, wav, etc.)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create audio_playlists table
CREATE TABLE IF NOT EXISTS audio_playlists (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    cover_image_url TEXT,
    is_public BOOLEAN DEFAULT TRUE,
    created_by UUID REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create playlist_tracks junction table
CREATE TABLE IF NOT EXISTS playlist_tracks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    playlist_id UUID REFERENCES audio_playlists(id) ON DELETE CASCADE,
    track_id UUID REFERENCES audio_tracks(id) ON DELETE CASCADE,
    position INTEGER NOT NULL,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(playlist_id, track_id)
);

-- Create audio_likes table for user likes
CREATE TABLE IF NOT EXISTS audio_likes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    track_id UUID REFERENCES audio_tracks(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, track_id)
);

-- Create audio_plays table for tracking plays
CREATE TABLE IF NOT EXISTS audio_plays (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    track_id UUID REFERENCES audio_tracks(id) ON DELETE CASCADE,
    play_duration INTEGER, -- How long they listened in seconds
    completed BOOLEAN DEFAULT FALSE, -- Whether they listened to the full track
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_audio_tracks_genre ON audio_tracks(genre);
CREATE INDEX IF NOT EXISTS idx_audio_tracks_artist ON audio_tracks(artist_name);
CREATE INDEX IF NOT EXISTS idx_audio_tracks_featured ON audio_tracks(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_audio_tracks_approved ON audio_tracks(is_approved) WHERE is_approved = true;
CREATE INDEX IF NOT EXISTS idx_audio_tracks_upload_date ON audio_tracks(upload_date DESC);
CREATE INDEX IF NOT EXISTS idx_audio_plays_track_id ON audio_plays(track_id);
CREATE INDEX IF NOT EXISTS idx_audio_likes_track_id ON audio_likes(track_id);
CREATE INDEX IF NOT EXISTS idx_playlist_tracks_playlist ON playlist_tracks(playlist_id, position);

-- Create storage policies for audio files

-- Allow public read access to audio files
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'audio-files');

-- Allow authenticated users to upload audio files
CREATE POLICY "Authenticated users can upload audio files"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'audio-files' 
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to update their own uploaded files
CREATE POLICY "Users can update own audio files"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'audio-files' 
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to delete their own uploaded files
CREATE POLICY "Users can delete own audio files"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'audio-files' 
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
);

-- RLS Policies for tables

-- Enable RLS on all tables
ALTER TABLE audio_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE audio_playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE playlist_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE audio_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE audio_plays ENABLE ROW LEVEL SECURITY;

-- Audio tracks policies
CREATE POLICY "Public can view approved tracks"
ON audio_tracks FOR SELECT
USING (is_approved = true);

CREATE POLICY "Users can view their own tracks"
ON audio_tracks FOR SELECT
USING (auth.uid() = uploaded_by);

CREATE POLICY "Users can insert their own tracks"
ON audio_tracks FOR INSERT
WITH CHECK (auth.uid() = uploaded_by);

CREATE POLICY "Users can update their own tracks"
ON audio_tracks FOR UPDATE
USING (auth.uid() = uploaded_by);

CREATE POLICY "Users can delete their own tracks"
ON audio_tracks FOR DELETE
USING (auth.uid() = uploaded_by);

-- Audio playlists policies
CREATE POLICY "Public can view public playlists"
ON audio_playlists FOR SELECT
USING (is_public = true);

CREATE POLICY "Users can view their own playlists"
ON audio_playlists FOR SELECT
USING (auth.uid() = created_by);

CREATE POLICY "Users can create playlists"
ON audio_playlists FOR INSERT
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own playlists"
ON audio_playlists FOR UPDATE
USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own playlists"
ON audio_playlists FOR DELETE
USING (auth.uid() = created_by);

-- Playlist tracks policies
CREATE POLICY "Anyone can view playlist tracks for public playlists"
ON playlist_tracks FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM audio_playlists 
        WHERE id = playlist_tracks.playlist_id 
        AND (is_public = true OR created_by = auth.uid())
    )
);

CREATE POLICY "Users can manage their own playlist tracks"
ON playlist_tracks FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM audio_playlists 
        WHERE id = playlist_tracks.playlist_id 
        AND created_by = auth.uid()
    )
);

-- Audio likes policies
CREATE POLICY "Users can view all likes"
ON audio_likes FOR SELECT
USING (true);

CREATE POLICY "Users can manage their own likes"
ON audio_likes FOR ALL
USING (auth.uid() = user_id);

-- Audio plays policies (for analytics)
CREATE POLICY "Users can view their own plays"
ON audio_plays FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Anyone can record plays"
ON audio_plays FOR INSERT
WITH CHECK (true);

-- Create functions for common operations

-- Function to increment play count
CREATE OR REPLACE FUNCTION increment_play_count(track_uuid UUID)
RETURNS void AS $$
BEGIN
    UPDATE audio_tracks 
    SET play_count = play_count + 1 
    WHERE id = track_uuid;
END;
$$ LANGUAGE plpgsql;

-- Function to toggle like
CREATE OR REPLACE FUNCTION toggle_track_like(track_uuid UUID, user_uuid UUID)
RETURNS boolean AS $$
DECLARE
    like_exists boolean;
BEGIN
    SELECT EXISTS(
        SELECT 1 FROM audio_likes 
        WHERE track_id = track_uuid AND user_id = user_uuid
    ) INTO like_exists;
    
    IF like_exists THEN
        DELETE FROM audio_likes 
        WHERE track_id = track_uuid AND user_id = user_uuid;
        
        UPDATE audio_tracks 
        SET like_count = like_count - 1 
        WHERE id = track_uuid;
        
        RETURN false;
    ELSE
        INSERT INTO audio_likes (track_id, user_id) 
        VALUES (track_uuid, user_uuid);
        
        UPDATE audio_tracks 
        SET like_count = like_count + 1 
        WHERE id = track_uuid;
        
        RETURN true;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to get trending tracks
CREATE OR REPLACE FUNCTION get_trending_tracks(limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
    id UUID,
    title VARCHAR,
    artist_name VARCHAR,
    file_url TEXT,
    cover_image_url TEXT,
    play_count INTEGER,
    like_count INTEGER,
    recent_plays BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.id,
        t.title,
        t.artist_name,
        t.file_url,
        t.cover_image_url,
        t.play_count,
        t.like_count,
        COALESCE(recent.play_count, 0) as recent_plays
    FROM audio_tracks t
    LEFT JOIN (
        SELECT 
            track_id,
            COUNT(*) as play_count
        FROM audio_plays 
        WHERE created_at >= NOW() - INTERVAL '7 days'
        GROUP BY track_id
    ) recent ON t.id = recent.track_id
    WHERE t.is_approved = true
    ORDER BY 
        recent_plays DESC,
        t.like_count DESC,
        t.play_count DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Insert some sample audio tracks for testing
INSERT INTO audio_tracks (
    title, artist_name, album_name, genre, duration, file_url, cover_image_url, 
    description, tags, is_featured, is_approved, uploaded_by
) VALUES 
(
    'Love''s Digital Dream',
    'Suno AI',
    'Digital Romance',
    'Electronic Pop',
    180,
    'https://your-storage-url/sample-audio/loves-digital-dream.mp3',
    'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
    'A beautiful AI-generated song about finding love in the digital age',
    ARRAY['love', 'digital', 'romance', 'electronic'],
    true,
    true,
    NULL
),
(
    'Kampala Nights',
    'Rising Star',
    'Ugandan Dreams',
    'Afrobeat',
    240,
    'https://your-storage-url/sample-audio/kampala-nights.mp3',
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop',
    'A vibrant afrobeat track celebrating Ugandan culture',
    ARRAY['uganda', 'afrobeat', 'culture', 'kampala'],
    false,
    true,
    NULL
),
(
    'Diaspora Heart',
    'Cultural Fusion',
    'Between Worlds',
    'World Music',
    210,
    'https://your-storage-url/sample-audio/diaspora-heart.mp3',
    'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=400&h=400&fit=crop',
    'An emotional piece about the diaspora experience',
    ARRAY['diaspora', 'emotional', 'cultural', 'world'],
    false,
    true,
    NULL
);

-- Create default playlists
INSERT INTO audio_playlists (name, description, is_public, created_by) VALUES
('Featured Tracks', 'Our handpicked collection of the best tracks', true, NULL),
('Romantic Vibes', 'Perfect songs for date nights and romantic moments', true, NULL),
('Cultural Sounds', 'Celebrating Ugandan and African music heritage', true, NULL);

-- Add tracks to default playlists
INSERT INTO playlist_tracks (playlist_id, track_id, position)
SELECT 
    p.id as playlist_id,
    t.id as track_id,
    ROW_NUMBER() OVER() as position
FROM audio_playlists p
CROSS JOIN audio_tracks t
WHERE p.name = 'Featured Tracks' AND t.is_featured = true;

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_audio_tracks_updated_at
    BEFORE UPDATE ON audio_tracks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_audio_playlists_updated_at
    BEFORE UPDATE ON audio_playlists
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Success message
SELECT 'Audio storage setup completed successfully!' as status; 