import express from 'express';
import User from '../models/User.js';

const router = express.Router();

router.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (username.length < 3) {
      return res.status(400).json({ error: 'Username must be at least 3 characters' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const existingUser = await User.findOne({
      $or: [{ username }, { email: email.toLowerCase() }]
    });

    if (existingUser) {
      const field = existingUser.username === username ? 'Username' : 'Email';
      return res.status(400).json({ error: `${field} already taken` });
    }

    const user = new User({ username, email, password });
    await user.save();

    req.session.userId = user._id;
    req.session.username = user.username;

    res.json({ success: true, user: { username: user.username, email: user.email } });
  } catch (error) {
    console.error('Signup error:', error.message);
    res.status(500).json({ error: 'Failed to create account' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const user = await User.findOne({
      $or: [
        { username: identifier },
        { email: identifier.toLowerCase() }
      ]
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    req.session.userId = user._id;
    req.session.username = user.username;

    res.json({ success: true, user: { username: user.username, email: user.email } });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ error: 'Login failed' });
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) console.error('Logout error:', err);
    res.redirect('/');
  });
});

router.get('/me', async (req, res) => {
  if (!req.session.userId) {
    return res.json({ user: null });
  }
  try {
    const user = await User.findById(req.session.userId)
      .select('username email solvedProblems counts createdAt')
      .lean();
    res.json({ user });
  } catch (error) {
    res.json({ user: null });
  }
});

export default router;
