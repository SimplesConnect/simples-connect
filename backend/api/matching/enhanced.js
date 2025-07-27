// Enhanced Matching API for Simples Connect
// Handles multi-purpose social networking matching with advanced scoring

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Helper function to extract user from JWT
const extractUser = async (req) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) throw new Error('No authorization token');
  
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) throw new Error('Invalid token');
  
  return user;
};

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

  try {
    const user = await extractUser(req);
    const userId = user.id;

    if (req.method === 'GET') {
      // GET /api/matching/enhanced - Get potential matches
      const { limit = 10 } = req.query;
      
      console.log('Fetching enhanced matches for user:', userId);
      
      const { data: matches, error } = await supabase.rpc('find_potential_matches', {
        current_user_id: userId,
        match_limit: parseInt(limit)
      });

      if (error) {
        console.error('Error fetching potential matches:', error);
        return res.status(500).json({ 
          success: false, 
          error: 'Failed to fetch matches',
          details: error.message 
        });
      }

      res.status(200).json({ 
        success: true, 
        matches: matches || [],
        count: matches?.length || 0
      });

    } else if (req.method === 'POST') {
      const { action, data } = req.body;

      if (action === 'get_mutual_matches') {
        // Get user's mutual matches
        console.log('Fetching mutual matches for user:', userId);
        
        const { data: mutualMatches, error } = await supabase.rpc('find_mutual_matches', {
          current_user_id: userId
        });

        if (error) {
          console.error('Error fetching mutual matches:', error);
          return res.status(500).json({ 
            success: false, 
            error: 'Failed to fetch mutual matches',
            details: error.message 
          });
        }

        res.status(200).json({ 
          success: true, 
          matches: mutualMatches || [],
          count: mutualMatches?.length || 0
        });

      } else if (action === 'calculate_match_score') {
        // Calculate match score between two users
        const { target_user_id } = data;
        
        if (!target_user_id) {
          return res.status(400).json({ 
            success: false, 
            error: 'target_user_id is required' 
          });
        }

        console.log('Calculating match score between users:', userId, 'and', target_user_id);
        
        const { data: score, error } = await supabase.rpc('calculate_match_score', {
          current_user_id: userId,
          target_user_id: target_user_id
        });

        if (error) {
          console.error('Error calculating match score:', error);
          return res.status(500).json({ 
            success: false, 
            error: 'Failed to calculate match score',
            details: error.message 
          });
        }

        // Get match label
        const { data: label, error: labelError } = await supabase.rpc('get_match_label', {
          match_score: score
        });

        if (labelError) {
          console.error('Error getting match label:', labelError);
        }

        res.status(200).json({ 
          success: true, 
          match_score: score,
          match_label: label || 'Unknown'
        });

      } else if (action === 'update_preferences') {
        // Update user's matching preferences
        const { preferences } = data;
        
        if (!preferences) {
          return res.status(400).json({ 
            success: false, 
            error: 'preferences object is required' 
          });
        }

        console.log('Updating matching preferences for user:', userId);
        
        // Validate preferences structure
        const allowedFields = [
          'intentions', 'vibe', 'life_phase', 'timezone_overlap_score',
          'value_alignment_score', 'communication_style', 'emotional_availability',
          'region_preference', 'conversation_boundaries'
        ];

        const filteredPreferences = {};
        Object.keys(preferences).forEach(key => {
          if (allowedFields.includes(key)) {
            filteredPreferences[key] = preferences[key];
          }
        });

        const { error } = await supabase
          .from('profiles')
          .update(filteredPreferences)
          .eq('id', userId);

        if (error) {
          console.error('Error updating preferences:', error);
          return res.status(500).json({ 
            success: false, 
            error: 'Failed to update preferences',
            details: error.message 
          });
        }

        res.status(200).json({ 
          success: true, 
          message: 'Preferences updated successfully',
          updated_fields: Object.keys(filteredPreferences)
        });

      } else if (action === 'get_matching_options') {
        // Get available matching options for frontend dropdowns
        console.log('Fetching matching options');
        
        const { data: options, error } = await supabase.rpc('get_matching_options');

        if (error) {
          console.error('Error fetching matching options:', error);
          return res.status(500).json({ 
            success: false, 
            error: 'Failed to fetch matching options',
            details: error.message 
          });
        }

        res.status(200).json({ 
          success: true, 
          options: options || {}
        });

      } else {
        return res.status(400).json({ 
          success: false, 
          error: 'Invalid action. Supported actions: get_mutual_matches, calculate_match_score, update_preferences, get_matching_options' 
        });
      }

    } else if (req.method === 'PUT') {
      // PUT /api/matching/enhanced - Update user's matching preferences
      const preferences = req.body;
      
      console.log('Updating user preferences via PUT:', userId);
      
      // Validate preferences structure
      const allowedFields = [
        'intentions', 'vibe', 'life_phase', 'timezone_overlap_score',
        'value_alignment_score', 'communication_style', 'emotional_availability',
        'region_preference', 'conversation_boundaries'
      ];

      const filteredPreferences = {};
      Object.keys(preferences).forEach(key => {
        if (allowedFields.includes(key)) {
          filteredPreferences[key] = preferences[key];
        }
      });

      const { error } = await supabase
        .from('profiles')
        .update(filteredPreferences)
        .eq('id', userId);

      if (error) {
        console.error('Error updating preferences:', error);
        return res.status(500).json({ 
          success: false, 
          error: 'Failed to update preferences',
          details: error.message 
        });
      }

      res.status(200).json({ 
        success: true, 
        message: 'Preferences updated successfully',
        updated_fields: Object.keys(filteredPreferences)
      });

    } else {
      res.status(405).json({ 
        success: false, 
        error: 'Method not allowed. Use GET, POST, or PUT.' 
      });
    }

  } catch (error) {
    console.error('Enhanced matching API error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error',
      message: error.message 
    });
  }
}; 