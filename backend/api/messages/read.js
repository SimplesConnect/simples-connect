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

// Vercel serverless function for /api/messages/read/[matchId]
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
  
  // Handle POST request for marking messages as read
  if (req.method === 'POST') {
    try {
      // Extract user from JWT
      const user = await extractUser(req);
      const userId = user.id;
      
      // Get matchId from query parameters or URL
      const matchId = req.query.matchId || req.url.split('/').pop();
      
      console.log('Marking messages as read for match:', matchId, 'user:', userId);
      
      if (!matchId) {
        return res.status(400).json({ 
          success: false, 
          error: 'Match ID is required' 
        });
      }
      
      // Mark all messages in this match as read where user is receiver
      const { error } = await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('match_id', matchId)
        .eq('receiver_id', userId)
        .eq('is_read', false);

      if (error) {
        console.error('Error marking messages as read:', error);
        throw error;
      }

      console.log('Messages marked as read successfully');

      res.status(200).json({ 
        success: true 
      });
      
    } catch (error) {
      console.error('Error marking messages as read:', error);
      res.status(500).json({ 
        success: false, 
        error: error.message || 'Failed to mark messages as read' 
      });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}; 