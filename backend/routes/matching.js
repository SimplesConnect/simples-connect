const express = require('express');
const supabase = require('../supabaseClient');
const requireAuth = require('../middleware/auth');
const router = express.Router();

// Get potential matches (excluding already interacted users)
router.get('/potential-matches', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
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
    res.json({ 
      success: true, 
      matches: potentialMatches || [],
      count: potentialMatches?.length || 0
    });
  } catch (error) {
    console.error('Error fetching potential matches:', error);
    res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Record user interaction (like/pass) and check for mutual matches
router.post('/interact', requireAuth, async (req, res) => {
  try {
    const { target_user_id, interaction_type } = req.body;
    const userId = req.user.id;
    
    console.log('Recording interaction:', { userId, target_user_id, interaction_type });
    
    if (!target_user_id || !['like', 'pass'].includes(interaction_type)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid interaction data' 
      });
    }
    
    // Record the interaction
    const { data: interaction, error: interactionError } = await supabase
      .from('user_interactions')
      .insert([{
        user_id: userId,
        target_user_id,
        interaction_type,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();
    
    if (interactionError) {
      console.error('Error recording interaction:', interactionError);
      throw interactionError;
    }
    
    console.log('Interaction recorded successfully:', interaction);
    
    let isMatch = false;
    let matchData = null;
    
    // If it's a like, check for mutual match
    if (interaction_type === 'like') {
      console.log('Checking for mutual like...');
      
      const { data: mutualLike } = await supabase
        .from('user_interactions')
        .select('*')
        .eq('user_id', target_user_id)
        .eq('target_user_id', userId)
        .eq('interaction_type', 'like')
        .single();
      
      console.log('Mutual like found:', !!mutualLike);
      
      if (mutualLike) {
        console.log('Creating match...');
        
        // Create a match record
        const { data: newMatch, error: matchError } = await supabase
          .from('matches')
          .insert([{
            user1_id: userId,
            user2_id: target_user_id,
            created_at: new Date().toISOString(),
            is_active: true
          }])
          .select(`
            *,
            user1_profile:profiles!matches_user1_id_fkey(id, full_name, profile_picture_url),
            user2_profile:profiles!matches_user2_id_fkey(id, full_name, profile_picture_url)
          `)
          .single();
        
        if (matchError) {
          console.error('Error creating match:', matchError);
          // Don't throw here - interaction was successful even if match creation failed
        } else {
          console.log('Match created successfully:', newMatch);
          isMatch = true;
          matchData = newMatch;
        }
      }
    }
    
    res.json({ 
      success: true, 
      interaction,
      is_match: isMatch,
      match_data: matchData
    });
  } catch (error) {
    console.error('Error recording interaction:', error);
    res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Get user's matches
router.get('/matches', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
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
    res.json({ 
      success: true, 
      matches: processedMatches,
      count: processedMatches.length
    });
  } catch (error) {
    console.error('Error fetching matches:', error);
    res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Get match statistics
router.get('/stats', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get interaction counts
    const { data: interactions } = await supabase
      .from('user_interactions')
      .select('interaction_type')
      .eq('user_id', userId);
    
    const likes = interactions?.filter(i => i.interaction_type === 'like').length || 0;
    const passes = interactions?.filter(i => i.interaction_type === 'pass').length || 0;
    
    // Get matches count
    const { data: matches } = await supabase
      .from('matches')
      .select('id')
      .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
      .eq('is_active', true);
    
    const matchCount = matches?.length || 0;
    
    // Get likes received (people who liked this user)
    const { data: likesReceived } = await supabase
      .from('user_interactions')
      .select('user_id')
      .eq('target_user_id', userId)
      .eq('interaction_type', 'like');
    
    const likesReceivedCount = likesReceived?.length || 0;
    
    res.json({
      success: true,
      stats: {
        likes_given: likes,
        passes_given: passes,
        matches: matchCount,
        likes_received: likesReceivedCount,
        total_interactions: likes + passes
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Unmatch (deactivate a match)
router.post('/unmatch', requireAuth, async (req, res) => {
  try {
    const { match_id } = req.body;
    const userId = req.user.id;
    
    if (!match_id) {
      return res.status(400).json({ 
        success: false, 
        error: 'Match ID is required' 
      });
    }
    
    // Verify user is part of this match and deactivate it
    const { data: match, error } = await supabase
      .from('matches')
      .update({ 
        is_active: false,
        updated_at: new Date().toISOString()
      })
      .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
      .eq('id', match_id)
      .eq('is_active', true)
      .select()
      .single();
    
    if (error) throw error;
    
    if (!match) {
      return res.status(404).json({ 
        success: false, 
        error: 'Match not found or already inactive' 
      });
    }
    
    res.json({ 
      success: true, 
      message: 'Match deactivated successfully',
      match 
    });
  } catch (error) {
    console.error('Error unmatching:', error);
    res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  }
});

module.exports = router; 