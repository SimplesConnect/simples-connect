const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client with service role for admin operations
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY // Service key for elevated permissions
);

// Extract and validate admin user from JWT token
const extractAdminUser = async (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('No authorization token provided');
  }
  
  const token = authHeader.substring(7);
  
  try {
    // Verify the JWT token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      throw new Error('Invalid or expired token');
    }

    // Check if user has admin privileges
    const { data: adminUser, error: adminError } = await supabase
      .from('admin_users')
      .select(`
        id,
        user_id,
        admin_level,
        is_active,
        permissions,
        profiles!inner(id, full_name, email)
      `)
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single();

    if (adminError || !adminUser) {
      throw new Error('User does not have admin privileges');
    }

    // Return admin user object with profile info
    return {
      id: user.id,
      email: user.email,
      adminLevel: adminUser.admin_level,
      isActive: adminUser.is_active,
      permissions: adminUser.permissions || {},
      profile: adminUser.profiles
    };
    
  } catch (error) {
    throw new Error(`Authentication failed: ${error.message}`);
  }
};

// Log admin action for audit trail
const logAdminAction = async (adminUser, actionType, targetType, targetId, description, metadata = {}, req = null) => {
  try {
    const auditData = {
      admin_user_id: adminUser.id,
      action_type: actionType,
      target_type: targetType,
      target_id: targetId,
      action_description: description,
      metadata: JSON.stringify({
        ...metadata,
        timestamp: new Date().toISOString(),
        admin_level: adminUser.adminLevel
      }),
      success: true
    };

    // Add request info if available
    if (req) {
      auditData.ip_address = req.ip || req.connection.remoteAddress;
      auditData.user_agent = req.headers['user-agent'];
    }

    const { error } = await supabase
      .from('admin_audit_logs')
      .insert([auditData]);

    if (error) {
      console.error('Failed to log admin action:', error);
    }
  } catch (error) {
    console.error('Error logging admin action:', error);
  }
};

// Middleware: Require any admin level
const requireAdmin = async (req, res, next) => {
  try {
    const adminUser = await extractAdminUser(req);
    req.adminUser = adminUser;
    
    // Log admin access
    await logAdminAction(
      adminUser,
      'admin_access',
      'system',
      null,
      `Admin accessed: ${req.method} ${req.path}`,
      { endpoint: req.path, method: req.method },
      req
    );
    
    next();
  } catch (error) {
    console.error('Admin authentication failed:', error);
    res.status(401).json({
      success: false,
      error: 'Admin authentication required',
      message: error.message
    });
  }
};

// Middleware: Require super admin level
const requireSuperAdmin = async (req, res, next) => {
  try {
    const adminUser = await extractAdminUser(req);
    
    if (adminUser.adminLevel !== 'super_admin') {
      throw new Error('Super admin privileges required');
    }
    
    req.adminUser = adminUser;
    
    // Log super admin access
    await logAdminAction(
      adminUser,
      'super_admin_access',
      'system',
      null,
      `Super admin accessed: ${req.method} ${req.path}`,
      { endpoint: req.path, method: req.method },
      req
    );
    
    next();
  } catch (error) {
    console.error('Super admin authentication failed:', error);
    res.status(403).json({
      success: false,
      error: 'Super admin privileges required',
      message: error.message
    });
  }
};

// Middleware: Require specific admin level or higher
const requireAdminLevel = (requiredLevel) => {
  const levelHierarchy = {
    'moderator': 1,
    'admin': 2,
    'super_admin': 3
  };

  return async (req, res, next) => {
    try {
      const adminUser = await extractAdminUser(req);
      
      const userLevel = levelHierarchy[adminUser.adminLevel] || 0;
      const reqLevel = levelHierarchy[requiredLevel] || 999;
      
      if (userLevel < reqLevel) {
        throw new Error(`${requiredLevel} privileges or higher required`);
      }
      
      req.adminUser = adminUser;
      
      // Log admin access with level check
      await logAdminAction(
        adminUser,
        'admin_level_access',
        'system',
        null,
        `Admin (${adminUser.adminLevel}) accessed: ${req.method} ${req.path}`,
        { 
          endpoint: req.path, 
          method: req.method, 
          required_level: requiredLevel 
        },
        req
      );
      
      next();
    } catch (error) {
      console.error('Admin level authentication failed:', error);
      res.status(403).json({
        success: false,
        error: `${requiredLevel} privileges or higher required`,
        message: error.message
      });
    }
  };
};

// Middleware: Check specific permission
const requirePermission = (permission) => {
  return async (req, res, next) => {
    try {
      const adminUser = await extractAdminUser(req);
      
      // Super admin always has all permissions
      if (adminUser.adminLevel === 'super_admin') {
        req.adminUser = adminUser;
        return next();
      }
      
      // Check specific permission
      if (!adminUser.permissions[permission]) {
        throw new Error(`Permission '${permission}' required`);
      }
      
      req.adminUser = adminUser;
      
      // Log permission-based access
      await logAdminAction(
        adminUser,
        'permission_access',
        'system',
        null,
        `Admin accessed ${req.method} ${req.path} with permission: ${permission}`,
        { 
          endpoint: req.path, 
          method: req.method, 
          permission: permission 
        },
        req
      );
      
      next();
    } catch (error) {
      console.error('Permission check failed:', error);
      res.status(403).json({
        success: false,
        error: `Permission '${permission}' required`,
        message: error.message
      });
    }
  };
};

// Rate limiting for admin endpoints
const adminRateLimit = {
  // Track requests per admin user
  requests: new Map(),
  
  // Clean up old entries every hour
  cleanup: setInterval(() => {
    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    for (const [userId, data] of adminRateLimit.requests) {
      if (data.lastReset < oneHourAgo) {
        adminRateLimit.requests.delete(userId);
      }
    }
  }, 60 * 60 * 1000), // Run every hour
  
  // Rate limit middleware
  middleware: (maxRequests = 100, windowMs = 60 * 60 * 1000) => {
    return (req, res, next) => {
      if (!req.adminUser) {
        return next(); // Skip if not authenticated as admin
      }
      
      const userId = req.adminUser.id;
      const now = Date.now();
      
      if (!adminRateLimit.requests.has(userId)) {
        adminRateLimit.requests.set(userId, {
          count: 1,
          lastReset: now
        });
        return next();
      }
      
      const userData = adminRateLimit.requests.get(userId);
      
      // Reset count if window has passed
      if (now - userData.lastReset > windowMs) {
        userData.count = 1;
        userData.lastReset = now;
        return next();
      }
      
      // Check if limit exceeded
      if (userData.count >= maxRequests) {
        return res.status(429).json({
          success: false,
          error: 'Too many admin requests',
          message: `Rate limit exceeded. Max ${maxRequests} requests per hour.`,
          resetTime: new Date(userData.lastReset + windowMs)
        });
      }
      
      userData.count++;
      next();
    };
  }
};

module.exports = {
  extractAdminUser,
  logAdminAction,
  requireAdmin,
  requireSuperAdmin,
  requireAdminLevel,
  requirePermission,
  adminRateLimit,
  supabase // Export for use in admin API endpoints
}; 