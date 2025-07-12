const supabase = require('../supabaseClient');

const requireAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token' });
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Make sure we have the user ID
    if (!user.id) {
      console.error('User object missing ID:', user);
      return res.status(401).json({ error: 'Invalid user data' });
    }

    // Set the user on the request object
    req.user = {
      id: user.id,
      email: user.email,
      ...user
    };

    console.log('Authenticated user:', req.user.id);
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    return res.status(401).json({ error: 'Authentication failed' });
  }
};

module.exports = requireAuth;