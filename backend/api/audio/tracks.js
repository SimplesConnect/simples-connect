const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Extract user from JWT token
async function extractUser(req) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return null; // Allow anonymous access for public content
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

// Vercel serverless function for /api/audio/tracks
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
  
  // Handle GET request - fetch audio tracks
  if (req.method === 'GET') {
    try {
      const { featured, trending, genre, limit = 20, offset = 0 } = req.query;
      
      let query = supabase
        .from('audio_tracks')
        .select(`
          id,
          title,
          artist_name,
          album_name,
          genre,
          duration,
          file_url,
          cover_image_url,
          description,
          tags,
          upload_date,
          is_featured,
          play_count,
          like_count,
          format
        `)
        .eq('is_approved', true)
        .order('upload_date', { ascending: false })
        .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);
      
      // Filter by featured tracks
      if (featured === 'true') {
        query = query.eq('is_featured', true);
      }
      
      // Filter by genre
      if (genre) {
        query = query.eq('genre', genre);
      }
      
      // Handle trending tracks
      if (trending === 'true') {
        // Use the trending function we created
        const { data: trendingTracks, error } = await supabase
          .rpc('get_trending_tracks', { limit_count: parseInt(limit) });
        
        if (error) throw error;
        
        return res.status(200).json({
          success: true,
          tracks: trendingTracks || []
        });
      }
      
      const { data: tracks, error } = await query;
      
      if (error) throw error;
      
      res.status(200).json({
        success: true,
        tracks: tracks || []
      });
      
    } catch (error) {
      console.error('Error fetching audio tracks:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch audio tracks'
      });
    }
  }
  
  // Handle POST request - upload/create new audio track
  else if (req.method === 'POST') {
    try {
      const user = await extractUser(req);
      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
      }
      
      const {
        title,
        artist_name,
        album_name,
        genre,
        duration,
        file_url,
        cover_image_url,
        description,
        tags,
        file_size,
        bitrate,
        format = 'mp3'
      } = req.body;
      
      // Validate required fields
      if (!title || !artist_name || !file_url) {
        return res.status(400).json({
          success: false,
          error: 'Title, artist name, and file URL are required'
        });
      }
      
      // Insert new track
      const { data: track, error } = await supabase
        .from('audio_tracks')
        .insert({
          title,
          artist_name,
          album_name,
          genre,
          duration,
          file_url,
          cover_image_url,
          description,
          tags,
          uploaded_by: user.id,
          file_size,
          bitrate,
          format,
          is_approved: false // Require manual approval
        })
        .select()
        .single();
      
      if (error) throw error;
      
      res.status(201).json({
        success: true,
        track
      });
      
    } catch (error) {
      console.error('Error creating audio track:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create audio track'
      });
    }
  }
  
  // Handle PUT request - update audio track
  else if (req.method === 'PUT') {
    try {
      const user = await extractUser(req);
      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
      }
      
      const { trackId } = req.query;
      const updateData = req.body;
      
      if (!trackId) {
        return res.status(400).json({
          success: false,
          error: 'Track ID is required'
        });
      }
      
      // Update track (RLS will ensure user can only update their own tracks)
      const { data: track, error } = await supabase
        .from('audio_tracks')
        .update(updateData)
        .eq('id', trackId)
        .eq('uploaded_by', user.id)
        .select()
        .single();
      
      if (error) throw error;
      
      if (!track) {
        return res.status(404).json({
          success: false,
          error: 'Track not found or unauthorized'
        });
      }
      
      res.status(200).json({
        success: true,
        track
      });
      
    } catch (error) {
      console.error('Error updating audio track:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update audio track'
      });
    }
  }
  
  // Handle DELETE request - delete audio track
  else if (req.method === 'DELETE') {
    try {
      const user = await extractUser(req);
      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
      }
      
      const { trackId } = req.query;
      
      if (!trackId) {
        return res.status(400).json({
          success: false,
          error: 'Track ID is required'
        });
      }
      
      // Delete track (RLS will ensure user can only delete their own tracks)
      const { error } = await supabase
        .from('audio_tracks')
        .delete()
        .eq('id', trackId)
        .eq('uploaded_by', user.id);
      
      if (error) throw error;
      
      res.status(200).json({
        success: true,
        message: 'Track deleted successfully'
      });
      
    } catch (error) {
      console.error('Error deleting audio track:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete audio track'
      });
    }
  }
  
  else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}; 