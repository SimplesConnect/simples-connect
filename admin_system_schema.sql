-- =================================================================
-- SIMPLES CONNECT ADMIN SYSTEM DATABASE SCHEMA
-- =================================================================

-- Admin Users Table for Role Management
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  admin_level VARCHAR(20) NOT NULL CHECK (admin_level IN ('super_admin', 'admin', 'moderator')),
  granted_by UUID REFERENCES profiles(id), -- Who granted admin access
  granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  revoked_at TIMESTAMP WITH TIME ZONE NULL,
  revoked_by UUID REFERENCES profiles(id),
  is_active BOOLEAN DEFAULT true,
  permissions JSONB DEFAULT '{}', -- Custom permissions for flexibility
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure one admin record per user
  UNIQUE(user_id, admin_level),
  
  -- Ensure only super_admin can grant super_admin
  CONSTRAINT valid_admin_hierarchy CHECK (
    (admin_level = 'super_admin' AND granted_by IS NULL) OR 
    (admin_level != 'super_admin')
  )
);

-- Audit Logs Table for Admin Action Tracking
CREATE TABLE IF NOT EXISTS admin_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID NOT NULL REFERENCES profiles(id),
  action_type VARCHAR(50) NOT NULL, -- 'user_suspend', 'user_ban', 'user_promote', etc.
  target_type VARCHAR(50) NOT NULL, -- 'user', 'content', 'system'
  target_id UUID, -- ID of the affected resource
  action_description TEXT NOT NULL,
  metadata JSONB DEFAULT '{}', -- Additional context (old values, new values, etc.)
  ip_address INET,
  user_agent TEXT,
  success BOOLEAN DEFAULT true,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Index for efficient querying
  INDEX idx_audit_logs_admin_user (admin_user_id),
  INDEX idx_audit_logs_action_type (action_type),
  INDEX idx_audit_logs_target (target_type, target_id),
  INDEX idx_audit_logs_created_at (created_at DESC)
);

-- Content Reports Table for Moderation
CREATE TABLE IF NOT EXISTS content_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID NOT NULL REFERENCES profiles(id),
  reported_user_id UUID NOT NULL REFERENCES profiles(id),
  reported_content_type VARCHAR(50) NOT NULL, -- 'profile', 'message', 'photo'
  reported_content_id UUID, -- ID of reported content
  report_reason VARCHAR(100) NOT NULL,
  report_description TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'resolved', 'dismissed')),
  priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  assigned_to UUID REFERENCES profiles(id), -- Admin assigned to handle this
  admin_notes TEXT,
  resolution_action VARCHAR(100), -- Action taken
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  INDEX idx_reports_status (status),
  INDEX idx_reports_priority (priority),
  INDEX idx_reports_assigned (assigned_to),
  INDEX idx_reports_created_at (created_at DESC)
);

-- User Status Tracking for Admin Actions
CREATE TABLE IF NOT EXISTS user_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  previous_status VARCHAR(20),
  new_status VARCHAR(20) NOT NULL,
  reason TEXT,
  admin_id UUID REFERENCES profiles(id),
  automatic BOOLEAN DEFAULT false, -- Was this an automated action?
  effective_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expiry_date TIMESTAMP WITH TIME ZONE, -- For temporary suspensions
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  INDEX idx_user_status_user_id (user_id),
  INDEX idx_user_status_admin_id (admin_id),
  INDEX idx_user_status_created_at (created_at DESC)
);

-- Platform Analytics Summary (Daily aggregates)
CREATE TABLE IF NOT EXISTS platform_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL UNIQUE,
  total_users INTEGER DEFAULT 0,
  new_signups INTEGER DEFAULT 0,
  active_users INTEGER DEFAULT 0, -- Users who logged in that day
  total_matches INTEGER DEFAULT 0,
  new_matches INTEGER DEFAULT 0,
  total_messages INTEGER DEFAULT 0,
  new_messages INTEGER DEFAULT 0,
  reported_content INTEGER DEFAULT 0,
  suspended_users INTEGER DEFAULT 0,
  banned_users INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  INDEX idx_analytics_date (date DESC)
);

-- =================================================================
-- EXTEND EXISTING TABLES
-- =================================================================

-- Add admin-related columns to profiles table
DO $$ 
BEGIN
  -- Add account status column
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'account_status') THEN
    ALTER TABLE profiles ADD COLUMN account_status VARCHAR(20) DEFAULT 'active' CHECK (account_status IN ('active', 'suspended', 'banned', 'pending_review'));
  END IF;
  
  -- Add admin notes column
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'admin_notes') THEN
    ALTER TABLE profiles ADD COLUMN admin_notes TEXT;
  END IF;
  
  -- Add suspension info
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'suspended_until') THEN
    ALTER TABLE profiles ADD COLUMN suspended_until TIMESTAMP WITH TIME ZONE;
  END IF;
  
  -- Add ban info
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'banned_at') THEN
    ALTER TABLE profiles ADD COLUMN banned_at TIMESTAMP WITH TIME ZONE;
  END IF;
  
  -- Add last activity tracking
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'last_active_at') THEN
    ALTER TABLE profiles ADD COLUMN last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
  END IF;
END $$;

-- =================================================================
-- CREATE INDEXES FOR PERFORMANCE
-- =================================================================

-- Profiles table indexes for admin queries
CREATE INDEX IF NOT EXISTS idx_profiles_account_status ON profiles(account_status);
CREATE INDEX IF NOT EXISTS idx_profiles_last_active ON profiles(last_active_at DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON profiles(created_at DESC);

-- Admin users indexes
CREATE INDEX IF NOT EXISTS idx_admin_users_user_id ON admin_users(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_users_level ON admin_users(admin_level);
CREATE INDEX IF NOT EXISTS idx_admin_users_active ON admin_users(is_active);

-- =================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =================================================================

-- Enable RLS on new tables
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_analytics ENABLE ROW LEVEL SECURITY;

-- Admin users policies (only admins can see admin data)
CREATE POLICY "Admin users read policy" ON admin_users FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.user_id = auth.uid() 
      AND au.is_active = true
    )
  );

CREATE POLICY "Super admin write policy" ON admin_users FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.user_id = auth.uid() 
      AND au.admin_level = 'super_admin'
      AND au.is_active = true
    )
  );

-- Audit logs policies (read-only for admins)
CREATE POLICY "Admin audit logs read policy" ON admin_audit_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.user_id = auth.uid() 
      AND au.is_active = true
    )
  );

CREATE POLICY "Admin audit logs insert policy" ON admin_audit_logs FOR INSERT
  WITH CHECK (
    admin_user_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.user_id = auth.uid() 
      AND au.is_active = true
    )
  );

-- Content reports policies
CREATE POLICY "Users can create reports" ON content_reports FOR INSERT
  WITH CHECK (reporter_id = auth.uid());

CREATE POLICY "Users can read own reports" ON content_reports FOR SELECT
  USING (reporter_id = auth.uid());

CREATE POLICY "Admins can read all reports" ON content_reports FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.user_id = auth.uid() 
      AND au.is_active = true
    )
  );

CREATE POLICY "Admins can update reports" ON content_reports FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.user_id = auth.uid() 
      AND au.is_active = true
    )
  );

-- =================================================================
-- HELPER FUNCTIONS
-- =================================================================

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_uuid UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users
    WHERE user_id = user_uuid
    AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get admin level
CREATE OR REPLACE FUNCTION get_admin_level(user_uuid UUID DEFAULT auth.uid())
RETURNS VARCHAR AS $$
DECLARE
  admin_level VARCHAR;
BEGIN
  SELECT au.admin_level INTO admin_level
  FROM admin_users au
  WHERE au.user_id = user_uuid
  AND au.is_active = true;
  
  RETURN COALESCE(admin_level, 'none');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log admin actions
CREATE OR REPLACE FUNCTION log_admin_action(
  admin_id UUID,
  action_type VARCHAR,
  target_type VARCHAR,
  target_id UUID,
  description TEXT,
  metadata JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
  log_id UUID;
BEGIN
  INSERT INTO admin_audit_logs (
    admin_user_id,
    action_type,
    target_type,
    target_id,
    action_description,
    metadata
  ) VALUES (
    admin_id,
    action_type,
    target_type,
    target_id,
    description,
    metadata
  ) RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =================================================================
-- INITIAL DATA
-- =================================================================

-- Create super admin for presheja@gmail.com
DO $$
DECLARE
  super_admin_profile_id UUID;
BEGIN
  -- Find the profile for presheja@gmail.com
  SELECT p.id INTO super_admin_profile_id
  FROM profiles p
  JOIN auth.users u ON p.id = u.id
  WHERE u.email = 'presheja@gmail.com';
  
  -- Create super admin if profile exists
  IF super_admin_profile_id IS NOT NULL THEN
    INSERT INTO admin_users (user_id, admin_level, granted_by, granted_at)
    VALUES (super_admin_profile_id, 'super_admin', NULL, NOW())
    ON CONFLICT (user_id, admin_level) DO NOTHING;
    
    -- Log the super admin creation
    PERFORM log_admin_action(
      super_admin_profile_id,
      'super_admin_created',
      'system',
      super_admin_profile_id,
      'Initial super admin account created for presheja@gmail.com',
      '{"automatic": true, "initial_setup": true}'::jsonb
    );
  END IF;
END $$;

-- =================================================================
-- COMMENTS FOR DOCUMENTATION
-- =================================================================

COMMENT ON TABLE admin_users IS 'Stores admin role assignments and permissions';
COMMENT ON TABLE admin_audit_logs IS 'Comprehensive audit trail for all admin actions';
COMMENT ON TABLE content_reports IS 'User-generated reports for content moderation';
COMMENT ON TABLE user_status_history IS 'Track all user status changes for accountability';
COMMENT ON TABLE platform_analytics IS 'Daily aggregated platform statistics';

COMMENT ON FUNCTION is_admin IS 'Check if a user has admin privileges';
COMMENT ON FUNCTION get_admin_level IS 'Get the admin level of a user';
COMMENT ON FUNCTION log_admin_action IS 'Log admin actions for audit trail'; 