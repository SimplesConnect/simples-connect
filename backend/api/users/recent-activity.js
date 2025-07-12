const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Extract user from JWT token
const extractUser = async (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('No authorization token provided');
  }
  
  const token = authHeader.substring(7);
  const { data, error } = await supabase.auth.getUser(token);
  
  if (error || !data.user) {
    throw new Error('Invalid token');
  }
  
  return data.user;
};

// Vercel serverless function for /api/users/recent-activity
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
  
  // Handle GET request for recent activity
  if (req.method === 'GET') {
    try {
      // Extract user from JWT
      const user = await extractUser(req);
      const userId = user.id;
      
      const activities = [];

      // Get recent likes received
      const { data: recentLikes } = await supabase
        .from('user_interactions')
        .select(`
          created_at,
          user_id,
          profiles!user_interactions_user_id_fkey(full_name, profile_picture_url)
        `)
        .eq('target_user_id', userId)
        .eq('interaction_type', 'like')
        .order('created_at', { ascending: false })
        .limit(5);

      if (recentLikes && recentLikes.length > 0) {
        activities.push({
          type: 'likes',
          icon: 'heart',
          message: `You received ${recentLikes.length} new like${recentLikes.length > 1 ? 's' : ''}!`,
          time: recentLikes[0].created_at,
          count: recentLikes.length,
          users: recentLikes.map(like => like.profiles)
        });
      }

      // Get recent matches
      const { data: recentMatches } = await supabase
        .from('matches')
        .select(`
          created_at,
          user1_id,
          user2_id,
          user1_profile:profiles!matches_user1_id_fkey(full_name, profile_picture_url),
          user2_profile:profiles!matches_user2_id_fkey(full_name, profile_picture_url)
        `)
        .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(3);

      if (recentMatches && recentMatches.length > 0) {
        activities.push({
          type: 'matches',
          icon: 'users',
          message: `You have ${recentMatches.length} new match${recentMatches.length > 1 ? 'es' : ''}!`,
          time: recentMatches[0].created_at,
          count: recentMatches.length,
          users: recentMatches.map(match => {
            const otherUser = match.user1_id === userId ? match.user2_profile : match.user1_profile;
            return otherUser;
          })
        });
      }

      // Sort activities by time (most recent first)
      activities.sort((a, b) => new Date(b.time) - new Date(a.time));

      res.status(200).json({ 
        success: true, 
        activities: activities.slice(0, 10) 
      });
      
    } catch (error) {
      console.error('Recent activity error:', error);
      res.status(401).json({ 
        success: false, 
        error: error.message === 'No authorization token provided' || error.message === 'Invalid token' 
          ? 'Authentication required' 
          : 'Internal server error' 
      });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}; 