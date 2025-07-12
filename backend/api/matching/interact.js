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

// Vercel serverless function for /api/matching/interact
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
  
  // Handle POST request for interact
  if (req.method === 'POST') {
    try {
      // Extract user from JWT
      const user = await extractUser(req);
      const userId = user.id;
      
      const { target_user_id, interaction_type } = req.body;
      
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
      
      res.status(200).json({ 
        success: true, 
        interaction,
        is_match: isMatch,
        match_data: matchData
      });
      
    } catch (error) {
      console.error('Interact route error:', error);
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