-- Content Moderation Database Schema
-- Manages advertiser requests and featured content

-- Advertiser Requests Table
CREATE TABLE IF NOT EXISTS advertiser_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    business_name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    business_description TEXT NOT NULL,
    target_audience TEXT,
    budget_range VARCHAR(100),
    content_type VARCHAR(100) NOT NULL, -- 'video', 'image', 'text'
    content_description TEXT,
    website_url VARCHAR(500),
    social_media_links JSONB DEFAULT '{}',
    additional_notes TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'review')),
    rejection_reason TEXT,
    reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Featured Content Table (YouTube videos)
CREATE TABLE IF NOT EXISTS featured_content (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    advertiser_request_id UUID REFERENCES advertiser_requests(id) ON DELETE SET NULL, -- Made optional
    title VARCHAR(255) NOT NULL,
    description TEXT,
    youtube_video_id VARCHAR(50) NOT NULL, -- YouTube video ID
    youtube_url VARCHAR(500) NOT NULL,
    thumbnail_url VARCHAR(500),
    duration_seconds INTEGER,
    is_active BOOLEAN DEFAULT false, -- Multiple videos can be active
    priority_order INTEGER DEFAULT 0, -- For ordering multiple videos
    start_date DATE,
    end_date DATE,
    view_count INTEGER DEFAULT 0,
    click_count INTEGER DEFAULT 0,
    advertiser_name VARCHAR(255) DEFAULT 'Simples Connect', -- For non-linked advertisers
    content_category VARCHAR(100) DEFAULT 'featured', -- 'featured', 'internal', 'promotional'
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Content Performance Analytics
CREATE TABLE IF NOT EXISTS content_analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    featured_content_id UUID REFERENCES featured_content(id) ON DELETE CASCADE,
    metric_name VARCHAR(100) NOT NULL, -- 'view', 'click', 'engagement'
    metric_value INTEGER DEFAULT 1,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_advertiser_requests_status ON advertiser_requests(status);
CREATE INDEX IF NOT EXISTS idx_advertiser_requests_created_at ON advertiser_requests(created_at);
CREATE INDEX IF NOT EXISTS idx_advertiser_requests_email ON advertiser_requests(email);

CREATE INDEX IF NOT EXISTS idx_featured_content_active ON featured_content(is_active);
CREATE INDEX IF NOT EXISTS idx_featured_content_advertiser ON featured_content(advertiser_request_id);
CREATE INDEX IF NOT EXISTS idx_featured_content_created_at ON featured_content(created_at);

CREATE INDEX IF NOT EXISTS idx_content_analytics_content_id ON content_analytics(featured_content_id);
CREATE INDEX IF NOT EXISTS idx_content_analytics_recorded_at ON content_analytics(recorded_at);

-- Enable Row Level Security
ALTER TABLE advertiser_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE featured_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for advertiser_requests (admin access only)
CREATE POLICY "Admin users can manage advertiser requests" ON advertiser_requests
    FOR ALL TO authenticated
    USING (
        auth.uid() IN (
            SELECT user_id FROM admin_users WHERE is_active = true
        )
    );

-- RLS Policies for featured_content (admin access only)
CREATE POLICY "Admin users can manage featured content" ON featured_content
    FOR ALL TO authenticated
    USING (
        auth.uid() IN (
            SELECT user_id FROM admin_users WHERE is_active = true
        )
    );

-- RLS Policies for content_analytics (admin read, system write)
CREATE POLICY "Admin users can view content analytics" ON content_analytics
    FOR SELECT TO authenticated
    USING (
        auth.uid() IN (
            SELECT user_id FROM admin_users WHERE is_active = true
        )
    );

CREATE POLICY "System can insert content analytics" ON content_analytics
    FOR INSERT TO authenticated
    WITH CHECK (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_advertiser_requests_updated_at ON advertiser_requests;
CREATE TRIGGER update_advertiser_requests_updated_at
    BEFORE UPDATE ON advertiser_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_featured_content_updated_at ON featured_content;
CREATE TRIGGER update_featured_content_updated_at
    BEFORE UPDATE ON featured_content
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to handle campaign date automation (optional - can be enabled later)
CREATE OR REPLACE FUNCTION check_campaign_dates()
RETURNS TRIGGER AS $$
BEGIN
    -- Auto-activate if start date is today or past and end date is future (if manual override not set)
    IF NEW.start_date IS NOT NULL AND NEW.end_date IS NOT NULL THEN
        IF CURRENT_DATE >= NEW.start_date AND CURRENT_DATE <= NEW.end_date THEN
            -- Only auto-activate if not manually set to inactive
            IF OLD.is_active IS NULL OR OLD.is_active = NEW.is_active THEN
                NEW.is_active = true;
            END IF;
        ELSIF CURRENT_DATE > NEW.end_date THEN
            -- Auto-deactivate expired campaigns (unless manually overridden)
            IF OLD.is_active IS NULL OR OLD.is_active = NEW.is_active THEN
                NEW.is_active = false;
            END IF;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for campaign date automation (commented out for MVP - enable if needed)
-- DROP TRIGGER IF EXISTS check_featured_content_campaign_dates ON featured_content;
-- CREATE TRIGGER check_featured_content_campaign_dates
--     BEFORE INSERT OR UPDATE ON featured_content
--     FOR EACH ROW
--     EXECUTE FUNCTION check_campaign_dates();

-- Function to get advertiser request statistics
CREATE OR REPLACE FUNCTION get_advertiser_stats()
RETURNS JSON AS $$
DECLARE
    result JSON;
    total_requests INTEGER;
    pending_requests INTEGER;
    approved_requests INTEGER;
    rejected_requests INTEGER;
    active_content INTEGER;
BEGIN
    -- Count requests by status
    SELECT COUNT(*) INTO total_requests FROM advertiser_requests;
    SELECT COUNT(*) INTO pending_requests FROM advertiser_requests WHERE status = 'pending';
    SELECT COUNT(*) INTO approved_requests FROM advertiser_requests WHERE status = 'approved';
    SELECT COUNT(*) INTO rejected_requests FROM advertiser_requests WHERE status = 'rejected';
    
    -- Count active content
    SELECT COUNT(*) INTO active_content FROM featured_content WHERE is_active = true;
    
    -- Build result JSON
    result := json_build_object(
        'totalRequests', total_requests,
        'pendingRequests', pending_requests,
        'approvedRequests', approved_requests,
        'rejectedRequests', rejected_requests,
        'activeContent', active_content,
        'lastUpdated', NOW()
    );
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_advertiser_stats() TO authenticated;

-- Function to extract YouTube video ID from URL
CREATE OR REPLACE FUNCTION extract_youtube_id(youtube_url TEXT)
RETURNS TEXT AS $$
DECLARE
    video_id TEXT;
BEGIN
    -- Handle different YouTube URL formats
    IF youtube_url LIKE '%youtube.com/watch?v=%' THEN
        video_id := substring(youtube_url from 'v=([A-Za-z0-9_-]+)');
    ELSIF youtube_url LIKE '%youtu.be/%' THEN
        video_id := substring(youtube_url from 'youtu\.be/([A-Za-z0-9_-]+)');
    ELSIF youtube_url LIKE '%youtube.com/embed/%' THEN
        video_id := substring(youtube_url from 'embed/([A-Za-z0-9_-]+)');
    ELSE
        -- Assume it's already a video ID
        video_id := youtube_url;
    END IF;
    
    RETURN video_id;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION extract_youtube_id(TEXT) TO authenticated;

-- Sample data for testing and initial content population
-- Uncomment these sections to populate initial data

/*
-- Sample advertiser requests
INSERT INTO advertiser_requests (
    business_name, 
    contact_person, 
    email, 
    phone,
    business_description, 
    target_audience,
    budget_range,
    content_type,
    content_description,
    website_url,
    status
) VALUES 
(
    'Kampala Coffee Co.', 
    'John Mukasa', 
    'john@kampalacoffee.ug', 
    '+256701234567',
    'Premium Ugandan coffee roasters serving the diaspora with authentic flavors from home.',
    'Ugandans abroad who miss home-style coffee',
    '$500-1000',
    'video',
    'Short video showcasing our coffee roasting process and diaspora testimonials',
    'https://kampalacoffee.ug',
    'pending'
),
(
    'Diaspora Events Uganda', 
    'Sarah Nakato', 
    'sarah@diasporaevents.com', 
    '+1-555-0123',
    'Organizing cultural events and gatherings for Ugandans in North America.',
    'Ugandan families and young professionals in US/Canada',
    '$1000-2500',
    'video',
    'Event highlights and upcoming cultural festival announcements',
    'https://diasporaevents.com',
    'approved'
);

-- Sample featured content (replace YouTube URLs with actual platform videos)
INSERT INTO featured_content (
    title,
    description,
    youtube_video_id,
    youtube_url,
    thumbnail_url,
    is_active,
    priority_order,
    advertiser_name,
    content_category
) VALUES 
(
    'Welcome to Simples Connect',
    'An introduction to our social networking platform for Ugandans in the diaspora.',
    'dQw4w9WgXcQ', -- Replace with actual video ID
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    true,
    1,
    'Simples Connect',
    'internal'
),
(
    'Community Success Stories',
    'Real stories from our community members about finding connections and building relationships.',
    'dQw4w9WgXcQ', -- Replace with actual video ID
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    true,
    2,
    'Simples Connect',
    'featured'
),
(
    'Cultural Events Highlights',
    'Highlights from recent cultural events and community gatherings.',
    'dQw4w9WgXcQ', -- Replace with actual video ID
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    false,
    3,
    'Simples Connect',
    'featured'
);
*/ 