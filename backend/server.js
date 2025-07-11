const express = require('express');
const cors = require('cors');

// Import all route modules
const authRoutes = require('./routes/auth');
const matchingRoutes = require('./routes/matching');
const messagesRoutes = require('./routes/messages');
const subscriptionRoutes = require('./routes/subscription');
const usersRoutes = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Mount all routes
app.use('/api/auth', authRoutes);
app.use('/api/matching', matchingRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/users', usersRoutes);

app.get('/', (req, res) => {
  res.send('Simples Connect backend is live 🚀');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
