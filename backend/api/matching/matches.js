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

// Vercel serverless function for /api/matching/matches
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
  
  // Handle GET request for matches
  if (req.method === 'GET') {
    try {
      // Extract user from JWT
      const user = await extractUser(req);
      const userId = user.id;
      
      console.log('Fetching matches for user:', userId);
      
      const { data: matches, error } = await supabase
        .from('matches')
        .select(`
          *,
          user1_profile:profiles!matches_user1_id_fkey(id, full_name, profile_picture_url, bio),
          user2_profile:profiles!matches_user2_id_fkey(id, full_name, profile_picture_url, bio)
        `)
        .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching matches:', error);
        throw error;
      }
      
      // Process matches to get the other user's info
      const processedMatches = matches?.map(match => {
        const isUser1 = match.user1_id === userId;
        const otherUser = isUser1 ? match.user2_profile : match.user1_profile;
        
        return {
          ...match,
          other_user: otherUser
        };
      }) || [];
      
      console.log('Found matches:', processedMatches.length);
      res.status(200).json({ 
        success: true, 
        matches: processedMatches,
        count: processedMatches.length
      });
      
    } catch (error) {
      console.error('Matches route error:', error);
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