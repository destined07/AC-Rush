import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';
import Admin from './models/Admin.js';
import User from './models/User.js';
import Problem from './models/Problem.js';
import { sampleProblems } from './scripts/seedProblems.js';
import problemRoutes from './routes/problems.js';
import submissionRoutes from './routes/submissions.js';
import aiRoutes from './routes/ai.js';
import adminRoutes from './routes/admin.js';
import authRoutes from './routes/auth.js';

dotenv.config();

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: process.env.SESSION_SECRET || 'algoforge-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
  }
}));

app.use((req, res, next) => {
  res.locals.user = req.session.userId ? {
    id: req.session.userId,
    username: req.session.username
  } : null;
  next();
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('MongoDB connected');
    try {
      const problemCount = await Problem.countDocuments();
      if (problemCount === 0) {
        await Problem.insertMany(sampleProblems);
        console.log(`Seeded ${sampleProblems.length} default problems`);
      }
    } catch (seedErr) {
      console.error('Problem seed initialization error:', seedErr);
    }

    try {
      const adminExists = await Admin.findOne({ username: 'admin' });
      if (!adminExists) {
        const admin = new Admin({
          username: 'admin',
          passwordHash: 'admin'
        });
        await admin.save();
        console.log('Default admin user created (username: admin, password: admin)');
      }
    } catch (err) {
      console.error('Admin initialization error:', err);
    }
  })
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/api/problems', problemRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/ai', aiRoutes);
app.use('/admin', adminRoutes);
app.use('/auth', authRoutes);

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/problem/:id', (req, res) => {
  res.render('problem');
});

app.get('/login', (req, res) => {
  if (req.session.userId) return res.redirect('/profile');
  res.render('login');
});

app.get('/signup', (req, res) => {
  if (req.session.userId) return res.redirect('/profile');
  res.render('signup');
});

app.get('/profile', async (req, res) => {
  if (!req.session.userId) return res.redirect('/login');
  try {
    const user = await User.findById(req.session.userId)
      .populate('solvedProblems', 'title difficulty category')
      .lean();
    if (!user) {
      req.session.destroy();
      return res.redirect('/login');
    }
    res.render('profile', { profileUser: user });
  } catch (err) {
    console.error('Profile error:', err);
    res.redirect('/');
  }
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/contact', (req, res) => {
  res.render('contact');
});

app.use((req, res) => {
  res.status(404).render('404');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('500', { error: err.message });
});

const PORT = parseInt(process.env.PORT || '3000', 10);

const startServer = (port) => {
  const server = app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} is in use, trying ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error('Server error:', err);
      process.exit(1);
    }
  });
};

startServer(PORT);
