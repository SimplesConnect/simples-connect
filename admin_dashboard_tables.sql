-- Admin Dashboard Tables Setup
-- This ensures all required tables exist for real dashboard statistics

-- Content Reports Table for Pending Reports functionality
CREATE TABLE IF NOT EXISTS content_reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    reporter_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    reported_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    reported_content_type VARCHAR(50) NOT NULL, -- 'profile', 'message', 'match'
    reported_content_id UUID,
    reason VARCHAR(500) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'resolved', 'dismissed')),
    priority VARCHAR(10) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'critical')),
    assigned_admin_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    resolution TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_content_reports_status ON content_reports(status);
CREATE INDEX IF NOT EXISTS idx_content_reports_priority ON content_reports(priority);
CREATE INDEX IF NOT EXISTS idx_content_reports_created_at ON content_reports(created_at);
CREATE INDEX IF NOT EXISTS idx_content_reports_reported_user ON content_reports(reported_user_id);

-- Platform Analytics Table for tracking platform health metrics
CREATE TABLE IF NOT EXISTS platform_analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    metric_name VARCHAR(100) NOT NULL,
    metric_value NUMERIC NOT NULL,
    metric_type VARCHAR(50) NOT NULL, -- 'count', 'percentage', 'duration', 'size'
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'
);

-- Create indexes for analytics
CREATE INDEX IF NOT EXISTS idx_platform_analytics_metric_name ON platform_analytics(metric_name);
CREATE INDEX IF NOT EXISTS idx_platform_analytics_recorded_at ON platform_analytics(recorded_at);

-- Ensure user_interactions table exists for activity tracking
CREATE TABLE IF NOT EXISTS user_interactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    target_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    interaction_type VARCHAR(20) NOT NULL CHECK (interaction_type IN ('like', 'pass', 'super_like', 'view')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for user interactions
CREATE INDEX IF NOT EXISTS idx_user_interactions_user_id ON user_interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_interactions_created_at ON user_interactions(created_at);
CREATE INDEX IF NOT EXISTS idx_user_interactions_type ON user_interactions(interaction_type);

-- Enable Row Level Security
ALTER TABLE content_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_interactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for content_reports (admin access only)
CREATE POLICY "Admin users can view all content reports" ON content_reports
    FOR SELECT TO authenticated
    USING (
        auth.uid() IN (
            SELECT user_id FROM admin_users WHERE is_active = true
        )
    );

CREATE POLICY "Admin users can insert content reports" ON content_reports
    FOR INSERT TO authenticated
    WITH CHECK (
        auth.uid() IN (
            SELECT user_id FROM admin_users WHERE is_active = true
        )
    );

CREATE POLICY "Admin users can update content reports" ON content_reports
    FOR UPDATE TO authenticated
    USING (
        auth.uid() IN (
            SELECT user_id FROM admin_users WHERE is_active = true
        )
    );

-- RLS Policies for platform_analytics (admin read, system write)
CREATE POLICY "Admin users can view platform analytics" ON platform_analytics
    FOR SELECT TO authenticated
    USING (
        auth.uid() IN (
            SELECT user_id FROM admin_users WHERE is_active = true
        )
    );

-- RLS Policies for user_interactions (user can manage their own, admin can view all)
CREATE POLICY "Users can manage their own interactions" ON user_interactions
    FOR ALL TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Admin users can view all user interactions" ON user_interactions
    FOR SELECT TO authenticated
    USING (
        auth.uid() IN (
            SELECT user_id FROM admin_users WHERE is_active = true
        )
    );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for content_reports updated_at
DROP TRIGGER IF EXISTS update_content_reports_updated_at ON content_reports;
CREATE TRIGGER update_content_reports_updated_at
    BEFORE UPDATE ON content_reports
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data for testing (optional)
-- Uncomment these lines if you want sample data for testing

/*
-- Sample content reports
INSERT INTO content_reports (reporter_id, reported_user_id, reported_content_type, reason, status, priority) VALUES
((SELECT id FROM auth.users LIMIT 1), (SELECT id FROM auth.users OFFSET 1 LIMIT 1), 'profile', 'Inappropriate profile picture', 'pending', 'normal'),
((SELECT id FROM auth.users LIMIT 1), (SELECT id FROM auth.users OFFSET 2 LIMIT 1), 'message', 'Spam or harassment', 'pending', 'high');

-- Sample platform metrics
INSERT INTO platform_analytics (metric_name, metric_value, metric_type) VALUES
('daily_active_users', 150, 'count'),
('average_session_duration', 25.5, 'duration'),
('server_response_time', 245, 'duration');
*/

-- Create a function to get real-time dashboard statistics
CREATE OR REPLACE FUNCTION get_dashboard_stats()
RETURNS JSON AS $$
DECLARE
    result JSON;
    total_users INTEGER;
    active_today INTEGER;
    total_matches INTEGER;
    pending_reports INTEGER;
BEGIN
    -- Count total users
    SELECT COUNT(*) INTO total_users FROM profiles;
    
    -- Count active users today (created or updated today)
    SELECT COUNT(*) INTO active_today 
    FROM profiles 
    WHERE DATE(created_at) = CURRENT_DATE 
       OR DATE(updated_at) = CURRENT_DATE;
    
    -- Count total matches
    SELECT COUNT(*) INTO total_matches FROM matches;
    
    -- Count pending reports
    SELECT COUNT(*) INTO pending_reports FROM content_reports WHERE status = 'pending';
    
    -- Build result JSON
    result := json_build_object(
        'totalUsers', total_users,
        'activeToday', active_today,
        'totalMatches', total_matches,
        'pendingReports', pending_reports,
        'lastUpdated', NOW()
    );
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_dashboard_stats() TO authenticated; 