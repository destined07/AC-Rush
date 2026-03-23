import express from 'express';
import Problem from '../models/Problem.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const problems = await Problem.find({})
      .select('_id title difficulty category tags')
      .sort({ createdAt: 1, _id: 1 });
    res.json(problems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id).lean();
    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }
    problem.examples = Array.isArray(problem.examples) ? problem.examples : [];
    problem.starterCode = problem.starterCode || {};
    delete problem.hiddenTestCases;
    res.json(problem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id/starter/:language', async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id).lean();
    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }
    const lang = req.params.language;
    const starter = problem.starterCode?.[lang] || problem.functionSignature?.[lang] || '';
    res.json({ starter });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id/examples', async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }
    res.json({ examples: problem.examples });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
