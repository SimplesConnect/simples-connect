const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Extract user from JWT token
async function extractUser(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    throw new Error('No authorization header');
  }
  
  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error } = await supabase.auth.getUser(token);
  
  if (error || !user) {
    throw new Error('Invalid token');
  }
  
  return user;
}

// Vercel serverless function for /api/matching/stats
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
  
  // Handle GET request for matching stats
  if (req.method === 'GET') {
    try {
      // Extract user from JWT
      const user = await extractUser(req);
      const userId = user.id;
      
      console.log('Fetching matching stats for user:', userId);
      
      // Get total matches
      const { data: matches, error: matchesError } = await supabase
        .from('matches')
        .select('id')
        .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
        .eq('is_active', true);
      
      if (matchesError) {
        console.error('Error fetching matches:', matchesError);
      }
      
      // Get total likes given
      const { data: likesGiven, error: likesGivenError } = await supabase
        .from('user_interactions')
        .select('id')
        .eq('user_id', userId)
        .eq('interaction_type', 'like');
      
      if (likesGivenError) {
        console.error('Error fetching likes given:', likesGivenError);
      }
      
      // Get total likes received
      const { data: likesReceived, error: likesReceivedError } = await supabase
        .from('user_interactions')
        .select('id')
        .eq('target_user_id', userId)
        .eq('interaction_type', 'like');
      
      if (likesReceivedError) {
        console.error('Error fetching likes received:', likesReceivedError);
      }
      
      // Get total interactions (likes + passes)
      const { data: totalInteractions, error: interactionsError } = await supabase
        .from('user_interactions')
        .select('id')
        .eq('user_id', userId);
      
      if (interactionsError) {
        console.error('Error fetching interactions:', interactionsError);
      }
      
      // Get unread messages count
      const { data: unreadMessages, error: messagesError } = await supabase
        .from('messages')
        .select('id')
        .eq('receiver_id', userId)
        .eq('is_read', false);
      
      if (messagesError) {
        console.error('Error fetching unread messages:', messagesError);
      }
      
      const stats = {
        totalMatches: matches?.length || 0,
        likesGiven: likesGiven?.length || 0,
        likesReceived: likesReceived?.length || 0,
        totalInteractions: totalInteractions?.length || 0,
        unreadMessages: unreadMessages?.length || 0,
        matchRate: (likesGiven?.length || 0) > 0 ? 
          Math.round(((matches?.length || 0) / (likesGiven?.length || 1)) * 100) : 0
      };
      
      console.log('Matching stats:', stats);
      
      res.status(200).json({ 
        success: true, 
        stats 
      });
      
    } catch (error) {
      console.error('Error fetching matching stats:', error);
      res.status(500).json({ 
        success: false, 
        error: error.message || 'Failed to fetch matching stats' 
      });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}; 