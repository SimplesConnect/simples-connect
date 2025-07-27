const { requireAdmin, requireSuperAdmin, logAdminAction, supabase } = require('../../middleware/adminAuth');

// Admin User Management Endpoint
module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    switch (req.method) {
      case 'GET':
        return await handleGetUsers(req, res);
      case 'POST':
        return await handleUserAction(req, res);
      case 'PUT':
        return await handleUpdateUser(req, res);
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error in admin users endpoint:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
};

// GET: Fetch users with pagination, search, and filters
async function handleGetUsers(req, res) {
  // Authenticate admin user
  await new Promise((resolve, reject) => {
    requireAdmin(req, res, (error) => {
      if (error) reject(error);
      else resolve();
    });
  });

  const {
    page = 1,
    limit = 20,
    search = '',
    status = 'all',
    sortBy = 'created_at',
    sortOrder = 'desc',
    adminLevel = 'all'
  } = req.query;

  try {
    const offset = (parseInt(page) - 1) * parseInt(limit);
    
    // Build base query
    let query = supabase
      .from('profiles')
      .select(`
        id,
        full_name,
        email,
        account_status,
        created_at,
        last_active_at,
        location,
        gender,
        birthdate,
        banned_at,
        suspended_until,
        admin_notes,
        admin_users(admin_level, is_active)
      `, { count: 'exact' });

    // Apply search filter
    if (search) {
      query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);
    }

    // Apply status filter
    if (status !== 'all') {
      query = query.eq('account_status', status);
    }

    // Apply admin level filter
    if (adminLevel !== 'all') {
      if (adminLevel === 'none') {
        query = query.is('admin_users', null);
      } else {
        query = query.not('admin_users', 'is', null);
      }
    }

    // Apply sorting
    const validSortFields = ['created_at', 'last_active_at', 'full_name'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'created_at';
    const order = sortOrder === 'asc' ? { ascending: true } : { ascending: false };
    
    query = query.order(sortField, order);

    // Apply pagination
    query = query.range(offset, offset + parseInt(limit) - 1);

    const { data: users, error, count } = await query;

    if (error) {
      throw new Error(`Failed to fetch users: ${error.message}`);
    }

    // Calculate additional user metrics
    const usersWithMetrics = await Promise.all(users.map(async (user) => {
      // Get user interaction counts
      const { count: totalMatches } = await supabase
        .from('matches')
        .select('id', { count: 'exact' })
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .eq('is_active', true);

      const { count: totalMessages } = await supabase
        .from('messages')
        .select('id', { count: 'exact' })
        .eq('sender_id', user.id);

      const { count: reportsAgainst } = await supabase
        .from('content_reports')
        .select('id', { count: 'exact' })
        .eq('reported_user_id', user.id);

      const { count: reportsMade } = await supabase
        .from('content_reports')
        .select('id', { count: 'exact' })
        .eq('reporter_id', user.id);

      return {
        ...user,
        isAdmin: user.admin_users && user.admin_users.length > 0,
        adminLevel: user.admin_users?.[0]?.admin_level || null,
        metrics: {
          totalMatches: totalMatches || 0,
          totalMessages: totalMessages || 0,
          reportsAgainst: reportsAgainst || 0,
          reportsMade: reportsMade || 0
        },
        age: user.birthdate ? calculateAge(user.birthdate) : null
      };
    }));

    // Log admin access
    await logAdminAction(
      req.adminUser,
      'users_list_accessed',
      'system',
      null,
      `Admin accessed users list (page ${page}, ${users.length} users)`,
      { 
        page: parseInt(page), 
        limit: parseInt(limit), 
        search, 
        status, 
        total_results: count 
      },
      req
    );

    res.status(200).json({
      success: true,
      data: {
        users: usersWithMetrics,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / parseInt(limit)),
          totalUsers: count,
          hasNext: (parseInt(page) * parseInt(limit)) < count,
          hasPrev: parseInt(page) > 1
        }
      }
    });

  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch users',
      message: error.message
    });
  }
}

// POST: Handle user actions (suspend, ban, promote, etc.)
async function handleUserAction(req, res) {
  const { action, userId, reason, duration, adminLevel } = req.body;

  if (!action || !userId) {
    return res.status(400).json({
      success: false,
      error: 'Action and userId are required'
    });
  }

  try {
    switch (action) {
      case 'suspend':
        return await suspendUser(req, res, userId, reason, duration);
      case 'unsuspend':
        return await unsuspendUser(req, res, userId, reason);
      case 'ban':
        return await banUser(req, res, userId, reason);
      case 'unban':
        return await unbanUser(req, res, userId, reason);
      case 'promote':
        return await promoteUser(req, res, userId, adminLevel, reason);
      case 'demote':
        return await demoteUser(req, res, userId, reason);
      default:
        return res.status(400).json({
          success: false,
          error: 'Invalid action'
        });
    }
  } catch (error) {
    console.error('Error handling user action:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to perform user action',
      message: error.message
    });
  }
}

// PUT: Update user profile/admin notes
async function handleUpdateUser(req, res) {
  // Authenticate admin user
  await new Promise((resolve, reject) => {
    requireAdmin(req, res, (error) => {
      if (error) reject(error);
      else resolve();
    });
  });

  const { userId } = req.query;
  const { adminNotes, accountStatus } = req.body;

  if (!userId) {
    return res.status(400).json({
      success: false,
      error: 'userId is required'
    });
  }

  try {
    const updateData = {};
    
    if (adminNotes !== undefined) {
      updateData.admin_notes = adminNotes;
    }
    
    if (accountStatus && ['active', 'suspended', 'banned', 'pending_review'].includes(accountStatus)) {
      updateData.account_status = accountStatus;
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update user: ${error.message}`);
    }

    // Log the update
    await logAdminAction(
      req.adminUser,
      'user_updated',
      'user',
      userId,
      `Admin updated user profile`,
      { updated_fields: Object.keys(updateData) },
      req
    );

    res.status(200).json({
      success: true,
      data: data,
      message: 'User updated successfully'
    });

  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update user',
      message: error.message
    });
  }
}

// Helper function: Suspend user
async function suspendUser(req, res, userId, reason, duration) {
  // Authenticate admin user
  await new Promise((resolve, reject) => {
    requireAdmin(req, res, (error) => {
      if (error) reject(error);
      else resolve();
    });
  });

  const suspendedUntil = duration ? 
    new Date(Date.now() + (parseInt(duration) * 24 * 60 * 60 * 1000)).toISOString() : 
    null;

  // Update user status
  const { error } = await supabase
    .from('profiles')
    .update({
      account_status: 'suspended',
      suspended_until: suspendedUntil,
      admin_notes: reason || 'Suspended by admin'
    })
    .eq('id', userId);

  if (error) {
    throw new Error(`Failed to suspend user: ${error.message}`);
  }

  // Log status change
  await supabase
    .from('user_status_history')
    .insert([{
      user_id: userId,
      previous_status: 'active',
      new_status: 'suspended',
      reason: reason || 'Suspended by admin',
      admin_id: req.adminUser.id,
      expiry_date: suspendedUntil
    }]);

  // Log admin action
  await logAdminAction(
    req.adminUser,
    'user_suspended',
    'user',
    userId,
    `User suspended: ${reason || 'No reason provided'}`,
    { duration: duration || 'indefinite', suspended_until: suspendedUntil },
    req
  );

  res.status(200).json({
    success: true,
    message: 'User suspended successfully'
  });
}

// Helper function: Ban user
async function banUser(req, res, userId, reason) {
  // Authenticate admin user (requires admin level or higher)
  await new Promise((resolve, reject) => {
    requireAdmin(req, res, (error) => {
      if (error) reject(error);
      else resolve();
    });
  });

  // Update user status
  const { error } = await supabase
    .from('profiles')
    .update({
      account_status: 'banned',
      banned_at: new Date().toISOString(),
      admin_notes: reason || 'Banned by admin'
    })
    .eq('id', userId);

  if (error) {
    throw new Error(`Failed to ban user: ${error.message}`);
  }

  // Log status change
  await supabase
    .from('user_status_history')
    .insert([{
      user_id: userId,
      previous_status: 'active',
      new_status: 'banned',
      reason: reason || 'Banned by admin',
      admin_id: req.adminUser.id
    }]);

  // Log admin action
  await logAdminAction(
    req.adminUser,
    'user_banned',
    'user',
    userId,
    `User banned: ${reason || 'No reason provided'}`,
    { banned_at: new Date().toISOString() },
    req
  );

  res.status(200).json({
    success: true,
    message: 'User banned successfully'
  });
}

// Helper function: Promote user to admin
async function promoteUser(req, res, userId, adminLevel, reason) {
  // Only super admin can promote users
  await new Promise((resolve, reject) => {
    requireSuperAdmin(req, res, (error) => {
      if (error) reject(error);
      else resolve();
    });
  });

  if (!['admin', 'moderator'].includes(adminLevel)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid admin level. Must be "admin" or "moderator"'
    });
  }

  // Check if user already has admin privileges
  const { data: existingAdmin } = await supabase
    .from('admin_users')
    .select('id')
    .eq('user_id', userId)
    .eq('is_active', true)
    .single();

  if (existingAdmin) {
    return res.status(400).json({
      success: false,
      error: 'User already has admin privileges'
    });
  }

  // Create admin user record
  const { error } = await supabase
    .from('admin_users')
    .insert([{
      user_id: userId,
      admin_level: adminLevel,
      granted_by: req.adminUser.id
    }]);

  if (error) {
    throw new Error(`Failed to promote user: ${error.message}`);
  }

  // Log admin action
  await logAdminAction(
    req.adminUser,
    'user_promoted',
    'user',
    userId,
    `User promoted to ${adminLevel}: ${reason || 'No reason provided'}`,
    { admin_level: adminLevel, granted_by: req.adminUser.id },
    req
  );

  res.status(200).json({
    success: true,
    message: `User promoted to ${adminLevel} successfully`
  });
}

// Helper function: Calculate age from birthdate
function calculateAge(birthdate) {
  const today = new Date();
  const birth = new Date(birthdate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
}

// Helper function: Unsuspend user
async function unsuspendUser(req, res, userId, reason) {
  await new Promise((resolve, reject) => {
    requireAdmin(req, res, (error) => {
      if (error) reject(error);
      else resolve();
    });
  });

  const { error } = await supabase
    .from('profiles')
    .update({
      account_status: 'active',
      suspended_until: null,
      admin_notes: reason || 'Unsuspended by admin'
    })
    .eq('id', userId);

  if (error) {
    throw new Error(`Failed to unsuspend user: ${error.message}`);
  }

  await logAdminAction(
    req.adminUser,
    'user_unsuspended',
    'user',
    userId,
    `User unsuspended: ${reason || 'No reason provided'}`,
    {},
    req
  );

  res.status(200).json({
    success: true,
    message: 'User unsuspended successfully'
  });
}

// Helper function: Unban user
async function unbanUser(req, res, userId, reason) {
  await new Promise((resolve, reject) => {
    requireAdmin(req, res, (error) => {
      if (error) reject(error);
      else resolve();
    });
  });

  const { error } = await supabase
    .from('profiles')
    .update({
      account_status: 'active',
      banned_at: null,
      admin_notes: reason || 'Unbanned by admin'
    })
    .eq('id', userId);

  if (error) {
    throw new Error(`Failed to unban user: ${error.message}`);
  }

  await logAdminAction(
    req.adminUser,
    'user_unbanned',
    'user',
    userId,
    `User unbanned: ${reason || 'No reason provided'}`,
    {},
    req
  );

  res.status(200).json({
    success: true,
    message: 'User unbanned successfully'
  });
}

// Helper function: Demote admin user
async function demoteUser(req, res, userId, reason) {
  await new Promise((resolve, reject) => {
    requireSuperAdmin(req, res, (error) => {
      if (error) reject(error);
      else resolve();
    });
  });

  const { error } = await supabase
    .from('admin_users')
    .update({
      is_active: false,
      revoked_at: new Date().toISOString(),
      revoked_by: req.adminUser.id
    })
    .eq('user_id', userId);

  if (error) {
    throw new Error(`Failed to demote user: ${error.message}`);
  }

  await logAdminAction(
    req.adminUser,
    'user_demoted',
    'user',
    userId,
    `User demoted from admin: ${reason || 'No reason provided'}`,
    { revoked_by: req.adminUser.id },
    req
  );

  res.status(200).json({
    success: true,
    message: 'User demoted successfully'
  });
} 