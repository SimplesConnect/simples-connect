// Vercel serverless function for /api/match/discover
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
  
  // Handle GET request for discover
  if (req.method === 'GET') {
    try {
      // Mock response for now - you can replace with real Supabase fetch later
      res.status(200).json([{ name: 'Test User', age: 25 }]);
    } catch (error) {
      console.error('Discover route error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}; 