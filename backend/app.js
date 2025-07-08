const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const matchingRoutes = require('./routes/matching');
const messagesRoutes = require('./routes/messages');
const subscriptionRoutes = require('./routes/subscription');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/matching', matchingRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/subscription', subscriptionRoutes);

module.exports = app; 