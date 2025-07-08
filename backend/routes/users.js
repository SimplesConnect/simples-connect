const express = require('express');
const supabase = require('../supabaseClient');
const requireAuth = require('../middleware/auth');
const router = express.Router();

// Get user profile (own profile)
router.get('/profile', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', req.user.id)
    .single();
  if (error) return res.status(400).json({ error: error.message });
  res.json({ profile: data });
});

// Get any user's profile by ID (for viewing other users)
router.get('/profile/:userId', requireAuth, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Only return public profile fields and only if profile is complete
    const { data, error } = await supabase
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
        is_profile_complete,
        created_at
      `)
      .eq('id', userId)
      .eq('is_profile_complete', true)
      .single();

    if (error) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    if (!data) {
      return res.status(404).json({ error: 'Profile not found or not complete' });
    }

    res.json({ profile: data });
  } catch (err) {
    console.error('Error fetching user profile:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user profile
router.put('/profile', requireAuth, async (req, res) => {
  const updates = req.body;
  const { data, error } = await supabase
    .from('profiles')
    .upsert({ ...updates, id: req.user.id });
  if (error) return res.status(400).json({ error: error.message });
  res.json({ profile: data });
});

// Get recent activity for dashboard
router.get('/recent-activity', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const activities = [];

    // Get recent likes received (people who liked this user)
    const { data: recentLikes, error: likesError } = await supabase
      .from('user_interactions')
      .select(`
        created_at,
        user_id,
        profiles!user_interactions_user_id_fkey(full_name, profile_picture_url)
      `)
      .eq('target_user_id', userId)
      .eq('interaction_type', 'like')
      .order('created_at', { ascending: false })
      .limit(10);

    if (!likesError && recentLikes) {
      // Group likes by time periods
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

      const todayLikes = recentLikes.filter(like => new Date(like.created_at) >= today);
      const yesterdayLikes = recentLikes.filter(like => 
        new Date(like.created_at) >= yesterday && new Date(like.created_at) < today
      );
      const weekLikes = recentLikes.filter(like => 
        new Date(like.created_at) >= weekAgo && new Date(like.created_at) < yesterday
      );

      if (todayLikes.length > 0) {
        activities.push({
          type: 'likes',
          icon: 'heart',
          message: `You received ${todayLikes.length} new like${todayLikes.length > 1 ? 's' : ''}!`,
          time: todayLikes[0].created_at,
          count: todayLikes.length,
          users: todayLikes.map(like => like.profiles)
        });
      }

      if (yesterdayLikes.length > 0) {
        activities.push({
          type: 'likes',
          icon: 'heart',
          message: `You received ${yesterdayLikes.length} like${yesterdayLikes.length > 1 ? 's' : ''} yesterday`,
          time: yesterdayLikes[0].created_at,
          count: yesterdayLikes.length,
          users: yesterdayLikes.map(like => like.profiles)
        });
      }

      if (weekLikes.length > 0) {
        activities.push({
          type: 'likes',
          icon: 'heart',
          message: `You received ${weekLikes.length} like${weekLikes.length > 1 ? 's' : ''} this week`,
          time: weekLikes[0].created_at,
          count: weekLikes.length,
          users: weekLikes.map(like => like.profiles)
        });
      }
    }

    // Get recent matches
    const { data: recentMatches, error: matchesError } = await supabase
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
      .limit(5);

    if (!matchesError && recentMatches && recentMatches.length > 0) {
      const matchesInLast24Hours = recentMatches.filter(match => 
        new Date(match.created_at) > new Date(Date.now() - 24 * 60 * 60 * 1000)
      );
      
      if (matchesInLast24Hours.length > 0) {
        activities.push({
          type: 'matches',
          icon: 'users',
          message: `You have ${matchesInLast24Hours.length} new match${matchesInLast24Hours.length > 1 ? 'es' : ''}!`,
          time: matchesInLast24Hours[0].created_at,
          count: matchesInLast24Hours.length,
          users: matchesInLast24Hours.map(match => {
            const otherUser = match.user1_id === userId ? match.user2_profile : match.user1_profile;
            return otherUser;
          })
        });
      }
    }

    // Get recent messages
    const { data: recentMessages, error: messagesError } = await supabase
      .from('messages')
      .select(`
        created_at,
        sender_id,
        content,
        match_id,
        matches!inner(
          user1_id,
          user2_id,
          user1_profile:profiles!matches_user1_id_fkey(full_name, profile_picture_url),
          user2_profile:profiles!matches_user2_id_fkey(full_name, profile_picture_url)
        )
      `)
      .neq('sender_id', userId) // Only messages sent TO this user
      .order('created_at', { ascending: false })
      .limit(5);

    if (!messagesError && recentMessages) {
      // Filter messages that are part of user's matches
      const userMessages = recentMessages.filter(msg => {
        const match = msg.matches;
        return match.user1_id === userId || match.user2_id === userId;
      });

      userMessages.forEach(msg => {
        const match = msg.matches;
        const sender = match.user1_id === msg.sender_id ? match.user1_profile : match.user2_profile;
        
        activities.push({
          type: 'message',
          icon: 'message-circle',
          message: `${sender.full_name} sent you a message`,
          time: msg.created_at,
          preview: msg.content.length > 50 ? msg.content.substring(0, 50) + '...' : msg.content,
          sender: sender,
          matchId: msg.match_id
        });
      });
    }

    // Sort all activities by time (most recent first)
    activities.sort((a, b) => new Date(b.time) - new Date(a.time));

    // Return top 10 most recent activities
    res.json({ 
      success: true, 
      activities: activities.slice(0, 10) 
    });

  } catch (error) {
    console.error('Error fetching recent activity:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch recent activity' 
    });
  }
});

// Get dashboard statistics
router.get('/dashboard-stats', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get total matches
    const { data: matches, error: matchesError } = await supabase
      .from('matches')
      .select('id')
      .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
      .eq('is_active', true);
    
    // Get total likes received
    const { data: likes, error: likesError } = await supabase
      .from('user_interactions')
      .select('id')
      .eq('target_user_id', userId)
      .eq('interaction_type', 'like');
    
    // Get unread messages count
    const { data: unreadMessages, error: messagesError } = await supabase
      .from('messages')
      .select('id')
      .eq('receiver_id', userId)
      .eq('is_read', false);
    
    // Get super likes (this would be a separate interaction type if implemented)
    // For now, we'll use a placeholder
    const superLikes = 0;
    
    const stats = {
      newMatches: matches?.length || 0,
      messages: unreadMessages?.length || 0,
      likes: likes?.length || 0,
      superLikes: superLikes
    };
    
    res.json({ 
      success: true, 
      stats 
    });
    
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch dashboard statistics' 
    });
  }
});

module.exports = router; 