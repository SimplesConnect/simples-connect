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

// Vercel serverless function for /api/matching/discover
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
  
  // Handle GET request for discover
  if (req.method === 'GET') {
    try {
      // Extract user from JWT
      const user = await extractUser(req);
      const userId = user.id;
      
      console.log('Fetching potential matches for user:', userId);
      
      // Get users that current user has already interacted with
      const { data: interactions } = await supabase
        .from('user_interactions')
        .select('target_user_id')
        .eq('user_id', userId);
      
      const interactedUserIds = interactions?.map(i => i.target_user_id) || [];
      console.log('Already interacted with:', interactedUserIds.length, 'users');
      
      // Build the query to exclude interacted users
      let query = supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          birthdate,
          bio,
          profile_picture_url,
          interests,
          location,
          gender,
          looking_for,
          created_at
        `)
        .neq('id', userId)
        .eq('is_profile_complete', true)
        .order('created_at', { ascending: false })
        .limit(20);
      
      // Exclude already interacted users if any exist
      if (interactedUserIds.length > 0) {
        query = query.not('id', 'in', `(${interactedUserIds.join(',')})`);
      }
      
      const { data: potentialMatches, error } = await query;
      
      if (error) {
        console.error('Error fetching potential matches:', error);
        throw error;
      }
      
      console.log('Found potential matches:', potentialMatches?.length || 0);
      res.status(200).json({ 
        success: true, 
        matches: potentialMatches || [],
        count: potentialMatches?.length || 0
      });
      
    } catch (error) {
      console.error('Discover route error:', error);
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