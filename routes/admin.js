import express from 'express';
import Admin from '../models/Admin.js';
import Problem from '../models/Problem.js';
import Submission from '../models/Submission.js';

const router = express.Router();

const requireAdmin = (req, res, next) => {
  if (!req.session || !req.session.adminId) {
    return res.redirect('/admin/login');
  }
  next();
};

router.get('/login', (req, res) => {
  res.render('admin/login', { error: null });
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.render('admin/login', { error: 'Username and password required' });
    }

    const admin = await Admin.findOne({ username });

    if (!admin) {
      return res.render('admin/login', { error: 'Invalid credentials' });
    }

    const isPasswordValid = await admin.comparePassword(password);

    if (!isPasswordValid) {
      return res.render('admin/login', { error: 'Invalid credentials' });
    }

    req.session.adminId = admin._id;
    req.session.username = admin.username;

    res.redirect('/admin/dashboard');
  } catch (error) {
    console.error('Login error:', error);
    res.render('admin/login', { error: 'Server error' });
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.redirect('/admin/login');
  });
});

router.get('/dashboard', requireAdmin, async (req, res) => {
  try {
    const problems = await Problem.find({}).lean();
    const totalSubmissions = await Submission.countDocuments({});

    res.render('admin/dashboard', {
      problems,
      totalSubmissions,
      username: req.session.username
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).render('500', { error: error.message });
  }
});

router.get('/add-problem', requireAdmin, (req, res) => {
  res.render('admin/add-problem', { error: null, problem: null });
});

router.post('/add-problem', requireAdmin, async (req, res) => {
  try {
    const {
      title,
      description,
      difficulty,
      category,
      constraints,
      checkerCode,
      useCustomChecker,
      starterCodePython,
      starterCodeCpp,
      starterCodeJava
    } = req.body;

    const exampleInputs = req.body.exampleInput || [];
    const exampleOutputs = req.body.exampleOutput || [];
    const hiddenInputs = req.body.hiddenInput || [];
    const hiddenOutputs = req.body.hiddenOutput || [];

    const examples = (Array.isArray(exampleInputs) ? exampleInputs : [exampleInputs]).map((input, idx) => ({
      input,
      output: (Array.isArray(exampleOutputs) ? exampleOutputs : [exampleOutputs])[idx] || '',
      isExample: true
    })).filter(tc => tc.input);

    const hiddenTestCases = (Array.isArray(hiddenInputs) ? hiddenInputs : [hiddenInputs]).map((input, idx) => ({
      input,
      output: (Array.isArray(hiddenOutputs) ? hiddenOutputs : [hiddenOutputs])[idx] || '',
      isExample: false
    })).filter(tc => tc.input);

    const problem = new Problem({
      title,
      description,
      difficulty,
      category,
      constraints,
      examples,
      hiddenTestCases,
      starterCode: {
        python: starterCodePython || '',
        cpp: starterCodeCpp || '',
        java: starterCodeJava || ''
      },
      checkerCode: useCustomChecker === 'on' ? checkerCode : null,
      useCustomChecker: useCustomChecker === 'on'
    });

    await problem.save();
    res.redirect('/admin/dashboard');
  } catch (error) {
    console.error('Add problem error:', error);
    res.render('admin/add-problem', {
      error: error.message,
      problem: req.body
    });
  }
});

router.get('/edit-problem/:id', requireAdmin, async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) {
      return res.status(404).render('404');
    }
    res.render('admin/edit-problem', { problem, error: null });
  } catch (error) {
    res.status(500).render('500', { error: error.message });
  }
});

router.post('/edit-problem/:id', requireAdmin, async (req, res) => {
  try {
    const {
      title,
      description,
      difficulty,
      category,
      constraints,
      checkerCode,
      useCustomChecker,
      starterCodePython,
      starterCodeCpp,
      starterCodeJava
    } = req.body;

    const exampleInputs = req.body.exampleInput || [];
    const exampleOutputs = req.body.exampleOutput || [];
    const hiddenInputs = req.body.hiddenInput || [];
    const hiddenOutputs = req.body.hiddenOutput || [];

    const examples = (Array.isArray(exampleInputs) ? exampleInputs : [exampleInputs]).map((input, idx) => ({
      input,
      output: (Array.isArray(exampleOutputs) ? exampleOutputs : [exampleOutputs])[idx] || '',
      isExample: true
    })).filter(tc => tc.input);

    const hiddenTestCases = (Array.isArray(hiddenInputs) ? hiddenInputs : [hiddenInputs]).map((input, idx) => ({
      input,
      output: (Array.isArray(hiddenOutputs) ? hiddenOutputs : [hiddenOutputs])[idx] || '',
      isExample: false
    })).filter(tc => tc.input);

    await Problem.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        difficulty,
        category,
        constraints,
        examples,
        hiddenTestCases,
        starterCode: {
          python: starterCodePython || '',
          cpp: starterCodeCpp || '',
          java: starterCodeJava || ''
        },
        checkerCode: useCustomChecker === 'on' ? checkerCode : null,
        useCustomChecker: useCustomChecker === 'on',
        updatedAt: Date.now()
      },
      { new: true }
    );

    res.redirect('/admin/dashboard');
  } catch (error) {
    const problem = await Problem.findById(req.params.id);
    res.render('admin/edit-problem', {
      problem,
      error: error.message
    });
  }
});

router.post('/delete-problem/:id', requireAdmin, async (req, res) => {
  try {
    await Problem.findByIdAndDelete(req.params.id);
    res.redirect('/admin/dashboard');
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/submissions', requireAdmin, async (req, res) => {
  try {
    const submissions = await Submission.find({})
      .populate('problemId', 'title')
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    res.render('admin/submissions', { submissions });
  } catch (error) {
    res.status(500).render('500', { error: error.message });
  }
});

export default router;
