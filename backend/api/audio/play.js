const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Extract user from JWT token (optional for play tracking)
async function extractUser(req) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return null; // Allow anonymous play tracking
    }
    
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return null;
    }
    
    return user;
  } catch (error) {
    return null;
  }
}

// Vercel serverless function for /api/audio/play
module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  // Handle POST request - record audio play
  if (req.method === 'POST') {
    try {
      const user = await extractUser(req);
      const { trackId, playDuration, completed } = req.body;
      
      if (!trackId) {
        return res.status(400).json({
          success: false,
          error: 'Track ID is required'
        });
      }
      
      // Get client IP and user agent for analytics
      const clientIP = req.headers['x-forwarded-for'] || 
                      req.headers['x-real-ip'] || 
                      req.connection?.remoteAddress ||
                      'unknown';
      const userAgent = req.headers['user-agent'] || 'unknown';
      
      // Record the play
      const { error: playError } = await supabase
        .from('audio_plays')
        .insert({
          track_id: trackId,
          user_id: user?.id || null,
          play_duration: playDuration || 0,
          completed: completed || false,
          ip_address: clientIP,
          user_agent: userAgent
        });
      
      if (playError) {
        console.error('Error recording play:', playError);
        // Don't throw error for play tracking - it's not critical
      }
      
      // Increment play count using the database function
      const { error: countError } = await supabase
        .rpc('increment_play_count', { track_uuid: trackId });
      
      if (countError) {
        console.error('Error incrementing play count:', countError);
      }
      
      res.status(200).json({
        success: true,
        message: 'Play recorded successfully'
      });
      
    } catch (error) {
      console.error('Error recording audio play:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to record play'
      });
    }
  }
  
  // Handle PUT request - toggle like
  else if (req.method === 'PUT') {
    try {
      const user = await extractUser(req);
      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required to like tracks'
        });
      }
      
      const { trackId } = req.body;
      
      if (!trackId) {
        return res.status(400).json({
          success: false,
          error: 'Track ID is required'
        });
      }
      
      // Toggle like using the database function
      const { data: isLiked, error } = await supabase
        .rpc('toggle_track_like', { 
          track_uuid: trackId, 
          user_uuid: user.id 
        });
      
      if (error) {
        console.error('Error toggling like:', error);
        throw new Error('Failed to update like status');
      }
      
      res.status(200).json({
        success: true,
        liked: isLiked,
        message: isLiked ? 'Track liked' : 'Track unliked'
      });
      
    } catch (error) {
      console.error('Error toggling track like:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update like status'
      });
    }
  }
  
  else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}; 