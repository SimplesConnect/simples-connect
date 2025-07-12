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

// Vercel serverless function for /api/messages/conversations
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
  
  // Handle GET request for conversations
  if (req.method === 'GET') {
    try {
      // Extract user from JWT
      const user = await extractUser(req);
      const userId = user.id;
      
      console.log('Fetching conversations for user:', userId);
      
      // Get all matches for the user
      const { data: matches, error: matchesError } = await supabase
        .from('matches')
        .select(`
          id,
          user1_id,
          user2_id,
          created_at,
          is_active
        `)
        .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (matchesError) {
        console.error('Error fetching matches:', matchesError);
        throw matchesError;
      }

      console.log('Found matches:', matches?.length || 0);

      // Get profile info for each match
      const conversations = await Promise.all(
        (matches || []).map(async (match) => {
          const otherUserId = match.user1_id === userId ? match.user2_id : match.user1_id;
          
          // Get other user's profile
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('id, full_name, profile_picture_url')
            .eq('id', otherUserId)
            .single();

          if (profileError) {
            console.error('Error fetching profile:', profileError);
            return null;
          }

          // Get last message in this match
          const { data: lastMessage, error: messageError } = await supabase
            .from('messages')
            .select('content, message_type, created_at')
            .eq('match_id', match.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          return {
            id: match.id,
            matchId: match.id,
            name: profile.full_name,
            photo: profile.profile_picture_url || 'https://images.unsplash.com/photo-1494790108755-2616b612b29c?w=400&h=400&fit=crop&crop=face',
            lastMessage: lastMessage ? 
              (lastMessage.message_type === 'image' ? '📷 Photo' : lastMessage.content) : 
              'Start a conversation!',
            lastMessageTime: lastMessage ? new Date(lastMessage.created_at) : new Date(match.created_at),
            otherUserId: otherUserId
          };
        })
      );

      // Filter out null entries and sort by last message time
      const validConversations = conversations
        .filter(conv => conv !== null)
        .sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime));

      console.log('Valid conversations:', validConversations.length);
      
      res.status(200).json({ 
        success: true, 
        conversations: validConversations 
      });
      
    } catch (error) {
      console.error('Error fetching conversations:', error);
      res.status(500).json({ 
        success: false, 
        error: error.message || 'Failed to fetch conversations' 
      });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}; 