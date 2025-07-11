const express = require('express');
const router = express.Router();

// Discover route - returns potential matches
router.get('/discover', async (req, res) => {
  try {
    // Mock response for now - you can replace with real Supabase fetch later
    res.json([{ name: 'Test User', age: 25 }]);
  } catch (error) {
    console.error('Discover route error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 