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

// Vercel serverless function for /api/users/dashboard-stats
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
  
  // Handle GET request for dashboard stats
  if (req.method === 'GET') {
    try {
      // Extract user from JWT
      const user = await extractUser(req);
      const userId = user.id;
      
      // Get total matches
      const { data: matches } = await supabase
        .from('matches')
        .select('id')
        .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
        .eq('is_active', true);
      
      // Get total likes received
      const { data: likes } = await supabase
        .from('user_interactions')
        .select('id')
        .eq('target_user_id', userId)
        .eq('interaction_type', 'like');
      
      // Get unread messages count - FIXED: Use correct column name
      const { data: unreadMessages } = await supabase
        .from('messages')
        .select('id')
        .eq('receiver_id', userId)  // Only messages sent TO this user
        .neq('sender_id', userId)    // Exclude messages sent BY this user
        .eq('is_read', false);
      
      const stats = {
        newMatches: matches?.length || 0,
        messages: unreadMessages?.length || 0,
        likes: likes?.length || 0,
        superLikes: 0 // Not implemented in free version
      };
      
      res.status(200).json({ 
        success: true, 
        stats 
      });
      
    } catch (error) {
      console.error('Dashboard stats error:', error);
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