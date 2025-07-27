const { requireAdmin, logAdminAction, supabase } = require('../../middleware/adminAuth');

// Admin Dashboard Statistics Endpoint
module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Authenticate admin user
    await new Promise((resolve, reject) => {
      requireAdmin(req, res, (error) => {
        if (error) reject(error);
        else resolve();
      });
    });

    // Fetch real-time platform statistics
    const stats = await fetchPlatformStats();
    
    // Log dashboard access
    await logAdminAction(
      req.adminUser,
      'dashboard_accessed',
      'system',
      null,
      'Admin accessed dashboard statistics',
      { stats_fetched: Object.keys(stats).length },
      req
    );

    res.status(200).json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString(),
      admin: {
        id: req.adminUser.id,
        level: req.adminUser.adminLevel
      }
    });

  } catch (error) {
    console.error('Error fetching admin dashboard stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard statistics',
      message: error.message
    });
  }
};

// Function to fetch comprehensive platform statistics
async function fetchPlatformStats() {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const oneWeekAgo = new Date(today);
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  
  const oneMonthAgo = new Date(today);
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  try {
    // Total users count
    const { count: totalUsers } = await supabase
      .from('profiles')
      .select('id', { count: 'exact' })
      .not('account_status', 'eq', 'banned');

    // New signups today
    const { count: newSignupsToday } = await supabase
      .from('profiles')
      .select('id', { count: 'exact' })
      .gte('created_at', today.toISOString().split('T')[0]);

    // New signups this week
    const { count: newSignupsThisWeek } = await supabase
      .from('profiles')
      .select('id', { count: 'exact' })
      .gte('created_at', oneWeekAgo.toISOString());

    // Active users today (users who logged in today)
    const { count: activeUsersToday } = await supabase
      .from('profiles')
      .select('id', { count: 'exact' })
      .gte('last_active_at', today.toISOString().split('T')[0])
      .not('account_status', 'eq', 'banned');

    // Active users this week
    const { count: activeUsersThisWeek } = await supabase
      .from('profiles')
      .select('id', { count: 'exact' })
      .gte('last_active_at', oneWeekAgo.toISOString())
      .not('account_status', 'eq', 'banned');

    // Total matches
    const { count: totalMatches } = await supabase
      .from('matches')
      .select('id', { count: 'exact' })
      .eq('is_active', true);

    // New matches today
    const { count: newMatchesToday } = await supabase
      .from('matches')
      .select('id', { count: 'exact' })
      .gte('created_at', today.toISOString().split('T')[0])
      .eq('is_active', true);

    // Total messages
    const { count: totalMessages } = await supabase
      .from('messages')
      .select('id', { count: 'exact' });

    // New messages today
    const { count: newMessagesToday } = await supabase
      .from('messages')
      .select('id', { count: 'exact' })
      .gte('created_at', today.toISOString().split('T')[0]);

    // User status breakdown
    const { data: userStatusBreakdown } = await supabase
      .from('profiles')
      .select('account_status')
      .not('account_status', 'is', null);

    const statusCounts = userStatusBreakdown.reduce((acc, user) => {
      acc[user.account_status] = (acc[user.account_status] || 0) + 1;
      return acc;
    }, {});

    // Pending reports
    const { count: pendingReports } = await supabase
      .from('content_reports')
      .select('id', { count: 'exact' })
      .eq('status', 'pending');

    // High priority reports
    const { count: highPriorityReports } = await supabase
      .from('content_reports')
      .select('id', { count: 'exact' })
      .eq('priority', 'high')
      .in('status', ['pending', 'reviewing']);

    // Recent admin actions (last 24 hours)
    const { count: recentAdminActions } = await supabase
      .from('admin_audit_logs')
      .select('id', { count: 'exact' })
      .gte('created_at', yesterday.toISOString());

    // Top growth metrics
    const { data: weeklySignups } = await supabase
      .from('profiles')
      .select('created_at')
      .gte('created_at', oneWeekAgo.toISOString())
      .order('created_at', { ascending: false });

    // Calculate daily signup trend for the past week
    const dailySignups = {};
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      dailySignups[dateStr] = 0;
    }

    weeklySignups?.forEach(signup => {
      const dateStr = signup.created_at.split('T')[0];
      if (dailySignups.hasOwnProperty(dateStr)) {
        dailySignups[dateStr]++;
      }
    });

    // Platform health indicators
    const platformHealth = {
      status: 'healthy', // Can be 'healthy', 'warning', 'critical'
      indicators: []
    };

    // Check various health metrics
    if (pendingReports > 10) {
      platformHealth.indicators.push({
        type: 'warning',
        message: `${pendingReports} pending reports need attention`
      });
    }

    if (highPriorityReports > 0) {
      platformHealth.indicators.push({
        type: 'critical',
        message: `${highPriorityReports} high priority reports require immediate action`
      });
      platformHealth.status = 'critical';
    }

    if (statusCounts.banned > totalUsers * 0.05) { // More than 5% banned
      platformHealth.indicators.push({
        type: 'warning',
        message: 'High percentage of banned users detected'
      });
    }

    if (newSignupsToday === 0 && today.getHours() > 12) {
      platformHealth.indicators.push({
        type: 'warning',
        message: 'No new signups today'
      });
    }

    return {
      overview: {
        totalUsers: totalUsers || 0,
        newSignupsToday: newSignupsToday || 0,
        newSignupsThisWeek: newSignupsThisWeek || 0,
        activeUsersToday: activeUsersToday || 0,
        activeUsersThisWeek: activeUsersThisWeek || 0
      },
      engagement: {
        totalMatches: totalMatches || 0,
        newMatchesToday: newMatchesToday || 0,
        totalMessages: totalMessages || 0,
        newMessagesToday: newMessagesToday || 0,
        engagementRate: totalUsers > 0 ? ((activeUsersThisWeek / totalUsers) * 100).toFixed(1) : 0
      },
      moderation: {
        pendingReports: pendingReports || 0,
        highPriorityReports: highPriorityReports || 0,
        recentAdminActions: recentAdminActions || 0
      },
      userStatus: {
        active: statusCounts.active || 0,
        suspended: statusCounts.suspended || 0,
        banned: statusCounts.banned || 0,
        pendingReview: statusCounts.pending_review || 0
      },
      trends: {
        dailySignups,
        growthRate: newSignupsThisWeek > 0 ? 
          ((newSignupsThisWeek / (totalUsers - newSignupsThisWeek)) * 100).toFixed(1) : 0
      },
      platformHealth
    };

  } catch (error) {
    console.error('Error fetching platform stats:', error);
    throw new Error('Failed to fetch platform statistics');
  }
} 