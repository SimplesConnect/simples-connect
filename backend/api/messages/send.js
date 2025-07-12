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

// Vercel serverless function for /api/messages/send
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
  
  // Handle POST request for sending messages
  if (req.method === 'POST') {
    try {
      // Extract user from JWT
      const user = await extractUser(req);
      const userId = user.id;
      
      const { match_id, content, message_type = 'text' } = req.body;

      console.log('Sending message:', { userId, match_id, content, message_type });

      if (!match_id || !content) {
        return res.status(400).json({ 
          success: false, 
          error: 'match_id and content are required' 
        });
      }

      // Verify user is part of this match
      const { data: match, error: matchError } = await supabase
        .from('matches')
        .select('user1_id, user2_id')
        .eq('id', match_id)
        .single();

      if (matchError) {
        console.error('Error fetching match:', matchError);
        throw matchError;
      }
      
      if (match.user1_id !== userId && match.user2_id !== userId) {
        return res.status(403).json({ 
          success: false, 
          error: 'Not authorized to send messages in this match' 
        });
      }

      // Determine receiver
      const receiver_id = match.user1_id === userId ? match.user2_id : match.user1_id;

      // Insert message
      const { data: message, error: messageError } = await supabase
        .from('messages')
        .insert([{
          match_id,
          sender_id: userId,
          receiver_id,
          content,
          message_type,
          is_read: false
        }])
        .select()
        .single();

      if (messageError) {
        console.error('Error sending message:', messageError);
        throw messageError;
      }

      console.log('Message sent successfully:', message.id);

      // Format response
      const formattedMessage = {
        id: message.id,
        from: 'me',
        text: message.content,
        type: message.message_type,
        time: new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isRead: message.is_read,
        senderId: message.sender_id,
        receiverId: message.receiver_id
      };

      res.status(200).json({ 
        success: true, 
        message: formattedMessage 
      });
      
    } catch (error) {
      console.error('Error sending message:', error);
      res.status(500).json({ 
        success: false, 
        error: error.message || 'Failed to send message' 
      });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}; 