-- Create database tables for Simples Connect new pages
-- Events, Lounge, and Resources functionality

-- Table for event suggestions from users
CREATE TABLE events_suggestions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    event_name TEXT NOT NULL,
    description TEXT,
    suggested_date DATE,
    user_name TEXT NOT NULL,
    email TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for lounge posts (stories and community questions)
CREATE TABLE lounge_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    post_type TEXT NOT NULL CHECK (post_type IN ('story', 'question')),
    is_anonymous BOOLEAN DEFAULT FALSE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for resource topic requests
CREATE TABLE resource_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    topic_suggestion TEXT NOT NULL,
    importance_reason TEXT,
    user_name TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for music submissions
CREATE TABLE music_submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    artist_name TEXT NOT NULL,
    song_title TEXT NOT NULL,
    youtube_url TEXT NOT NULL,
    album_cover_url TEXT,
    genre TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_events_suggestions_user_id ON events_suggestions(user_id);
CREATE INDEX idx_events_suggestions_created_at ON events_suggestions(created_at);
CREATE INDEX idx_lounge_posts_user_id ON lounge_posts(user_id);
CREATE INDEX idx_lounge_posts_type ON lounge_posts(post_type);
CREATE INDEX idx_lounge_posts_created_at ON lounge_posts(created_at);
CREATE INDEX idx_resource_requests_user_id ON resource_requests(user_id);
CREATE INDEX idx_resource_requests_created_at ON resource_requests(created_at);
CREATE INDEX idx_music_submissions_user_id ON music_submissions(user_id);
CREATE INDEX idx_music_submissions_created_at ON music_submissions(created_at);

-- Row Level Security (RLS) policies
ALTER TABLE events_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE lounge_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE music_submissions ENABLE ROW LEVEL SECURITY;

-- Policy for events_suggestions
CREATE POLICY "Users can insert their own event suggestions" ON events_suggestions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view all approved event suggestions" ON events_suggestions
    FOR SELECT USING (status = 'approved' OR auth.uid() = user_id);

CREATE POLICY "Users can update their own event suggestions" ON events_suggestions
    FOR UPDATE USING (auth.uid() = user_id);

-- Policy for lounge_posts
CREATE POLICY "Users can insert their own lounge posts" ON lounge_posts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view all approved lounge posts" ON lounge_posts
    FOR SELECT USING (status = 'approved' OR auth.uid() = user_id);

CREATE POLICY "Users can update their own lounge posts" ON lounge_posts
    FOR UPDATE USING (auth.uid() = user_id);

-- Policy for resource_requests
CREATE POLICY "Users can insert their own resource requests" ON resource_requests
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view all approved resource requests" ON resource_requests
    FOR SELECT USING (status = 'approved' OR auth.uid() = user_id);

CREATE POLICY "Users can update their own resource requests" ON resource_requests
    FOR UPDATE USING (auth.uid() = user_id);

-- Policy for music_submissions
CREATE POLICY "Users can insert their own music submissions" ON music_submissions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view all approved music submissions" ON music_submissions
    FOR SELECT USING (status = 'approved' OR auth.uid() = user_id);

CREATE POLICY "Users can update their own music submissions" ON music_submissions
    FOR UPDATE USING (auth.uid() = user_id);

-- Create functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_events_suggestions_updated_at BEFORE UPDATE ON events_suggestions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lounge_posts_updated_at BEFORE UPDATE ON lounge_posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_resource_requests_updated_at BEFORE UPDATE ON resource_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_music_submissions_updated_at BEFORE UPDATE ON music_submissions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 