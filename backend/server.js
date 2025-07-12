const express = require('express');
const cors = require('cors');

// Import all route modules
const authRoutes = require('./routes/auth');
const matchingRoutes = require('./routes/matching');
const messagesRoutes = require('./routes/messages');

const usersRoutes = require('./routes/users');

const app = express();

app.use(cors());
app.use(express.json());

// Mount all routes
app.use('/api/auth', authRoutes);
app.use('/api/matching', matchingRoutes);
app.use('/api/messages', messagesRoutes);

app.use('/api/users', usersRoutes);

app.get('/', (req, res) => {
  res.send('Simples Connect backend is live 🚀');
});

// Export app for Vercel serverless functions
module.exports = app;
