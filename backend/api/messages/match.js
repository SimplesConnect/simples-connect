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

// Vercel serverless function for /api/messages/match/[matchId]
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
  
  // Handle GET request for match messages
  if (req.method === 'GET') {
    try {
      // Extract user from JWT
      const user = await extractUser(req);
      const userId = user.id;
      
      // Get matchId from query parameters or URL
      const matchId = req.query.matchId || req.url.split('/').pop();
      
      console.log('Fetching messages for match:', matchId, 'user:', userId);
      
      if (!matchId) {
        return res.status(400).json({ 
          success: false, 
          error: 'Match ID is required' 
        });
      }
      
      // Verify user is part of this match
      const { data: match, error: matchError } = await supabase
        .from('matches')
        .select('user1_id, user2_id')
        .eq('id', matchId)
        .single();

      if (matchError) {
        console.error('Error fetching match:', matchError);
        throw matchError;
      }
      
      if (match.user1_id !== userId && match.user2_id !== userId) {
        return res.status(403).json({ 
          success: false, 
          error: 'Not authorized to view this conversation' 
        });
      }

      // Get messages for this match
      const { data: messages, error: messagesError } = await supabase
        .from('messages')
        .select(`
          id,
          sender_id,
          receiver_id,
          content,
          message_type,
          created_at,
          is_read
        `)
        .eq('match_id', matchId)
        .order('created_at', { ascending: true });

      if (messagesError) {
        console.error('Error fetching messages:', messagesError);
        throw messagesError;
      }

      // Format messages for frontend
      const formattedMessages = (messages || []).map(msg => ({
        id: msg.id,
        from: msg.sender_id === userId ? 'me' : 'them',
        text: msg.content,
        type: msg.message_type,
        time: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isRead: msg.is_read,
        senderId: msg.sender_id,
        receiverId: msg.receiver_id
      }));

      console.log('Found messages:', formattedMessages.length);

      res.status(200).json({ 
        success: true, 
        messages: formattedMessages 
      });
      
    } catch (error) {
      console.error('Error fetching messages:', error);
      res.status(500).json({ 
        success: false, 
        error: error.message || 'Failed to fetch messages' 
      });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}; 