const express = require('express');
const cors = require('cors');

// Import all route modules
const authRoutes = require('./routes/auth');
const matchingRoutes = require('./routes/matching');
const messagesRoutes = require('./routes/messages');
const usersRoutes = require('./routes/users');
const audioRoutes = require('./routes/audio');

const app = express();

app.use(cors());
app.use(express.json());

// Mount all routes
app.use('/api/auth', authRoutes);
app.use('/api/matching', matchingRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/audio', audioRoutes);

app.get('/', (req, res) => {
  res.send('Simples Connect backend is live 🚀');
});

// Get port from environment or default to 10000
const PORT = process.env.PORT || 10000;

// Start the server - THIS WAS MISSING!
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🎯 Simples Connect backend is ready!`);
});

// Export app for Vercel serverless functions (if needed)
module.exports = app;