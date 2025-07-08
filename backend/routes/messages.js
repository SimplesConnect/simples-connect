const express = require('express');
const supabase = require('../supabaseClient');
const requireAuth = require('../middleware/auth');
const router = express.Router();

// Get all conversations (matches) for user
router.get('/conversations', requireAuth, async (req, res) => {
  try {
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
      .or(`user1_id.eq.${req.user.id},user2_id.eq.${req.user.id}`)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (matchesError) throw matchesError;

    // Get profile info for each match
    const conversations = await Promise.all(matches.map(async (match) => {
      const otherUserId = match.user1_id === req.user.id ? match.user2_id : match.user1_id;
      
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
    }));

    // Filter out null entries and sort by last message time
    const validConversations = conversations
      .filter(conv => conv !== null)
      .sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime));

    res.json({ conversations: validConversations });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(400).json({ error: error.message });
  }
});

// Get messages in a match
router.get('/match/:matchId', requireAuth, async (req, res) => {
  try {
    const { matchId } = req.params;
    
    // Verify user is part of this match
    const { data: match, error: matchError } = await supabase
      .from('matches')
      .select('user1_id, user2_id')
      .eq('id', matchId)
      .single();

    if (matchError) throw matchError;
    
    if (match.user1_id !== req.user.id && match.user2_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to view this conversation' });
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

    if (messagesError) throw messagesError;

    // Format messages for frontend
    const formattedMessages = messages.map(msg => ({
      id: msg.id,
      from: msg.sender_id === req.user.id ? 'me' : 'them',
      text: msg.content,
      type: msg.message_type,
      time: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: msg.is_read,
      senderId: msg.sender_id,
      receiverId: msg.receiver_id
    }));

    res.json({ messages: formattedMessages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(400).json({ error: error.message });
  }
});

// Send a message
router.post('/send', requireAuth, async (req, res) => {
  try {
    const { match_id, content, message_type = 'text' } = req.body;

    if (!match_id || !content) {
      return res.status(400).json({ error: 'match_id and content are required' });
    }

    // Verify user is part of this match
    const { data: match, error: matchError } = await supabase
      .from('matches')
      .select('user1_id, user2_id')
      .eq('id', match_id)
      .single();

    if (matchError) throw matchError;
    
    if (match.user1_id !== req.user.id && match.user2_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to send messages in this match' });
    }

    // Determine receiver
    const receiver_id = match.user1_id === req.user.id ? match.user2_id : match.user1_id;

    // Insert message
    const { data: message, error: messageError } = await supabase
      .from('messages')
      .insert([{
        match_id,
        sender_id: req.user.id,
        receiver_id,
        content,
        message_type,
        is_read: false
      }])
      .select()
      .single();

    if (messageError) throw messageError;

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

    res.json({ message: formattedMessage });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(400).json({ error: error.message });
  }
});

// Mark messages as read
router.post('/read/:matchId', requireAuth, async (req, res) => {
  try {
    const { matchId } = req.params;
    
    // Mark all messages in this match as read where user is receiver
    const { error } = await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('match_id', matchId)
      .eq('receiver_id', req.user.id)
      .eq('is_read', false);

    if (error) throw error;

    res.json({ success: true });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router; 