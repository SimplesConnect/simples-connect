const express = require('express');
const supabase = require('../supabaseClient');
const router = express.Router();

// Get audio tracks
router.get('/tracks', async (req, res) => {
  try {
    const { featured, limit = 10 } = req.query;
    
    let query = supabase
      .from('audio_tracks')
      .select('*')
      .eq('is_approved', true)
      .order('created_at', { ascending: false });
    
    if (featured === 'true') {
      query = query.eq('is_featured', true);
    }
    
    query = query.limit(limit);
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    res.json({ 
      success: true, 
      tracks: data || [] 
    });
  } catch (error) {
    console.error('Error fetching tracks:', error);
    res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  }
});

module.exports = router;