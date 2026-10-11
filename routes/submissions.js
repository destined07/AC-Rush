import express from 'express';
import Submission from '../models/Submission.js';
import Problem from '../models/Problem.js';
import User from '../models/User.js';
import { executeCodeOneCompiler } from '../utils/onecompiler.js';
import { compareOutput } from '../utils/outputCompare.js';

const router = express.Router();

router.post('/run', async (req, res) => {
  try {
    const { code, language, input = '' } = req.body;

    if (!code || !language) {
      return res.status(400).json({ error: 'Missing code or language' });
    }

    const result = await executeCodeOneCompiler(code, language, input);

    res.json({
      status: result.status,
      output: result.output,
      error: result.error,
      executionTime: result.executionTime,
      memory: result.memory
    });
  } catch (error) {
    console.error('Run error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

router.post('/submit', async (req, res) => {
  try {
    const { problemId, code, language } = req.body;

    if (!problemId || !code || !language) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const problem = await Problem.findById(problemId).lean();
    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }

    const hiddenTests = Array.isArray(problem.hiddenTestCases) ? problem.hiddenTestCases : [];
    if (hiddenTests.length === 0) {
      return res.status(400).json({ error: 'No hidden test cases configured for this problem' });
    }

    let passedCount = 0;
    let finalStatus = 'Accepted';
    let finalOutput = '';
    let finalError = '';
    let maxTime = 0;

    for (let i = 0; i < hiddenTests.length; i++) {
      const tc = hiddenTests[i];
      const stdin = tc.input || '';
      const expectedOutput = tc.output || '';

      let result;
      try {
        result = await executeCodeOneCompiler(code, language, stdin);
      } catch (execErr) {
        finalStatus = 'Runtime Error';
        finalError = execErr.message;
        break;
      }

      maxTime = Math.max(maxTime, result.executionTime || 0);

      if (result.status === 'Compilation Error') {
        finalStatus = 'Compilation Error';
        finalError = result.error || 'Compilation failed';
        break;
      }

      if (result.status === 'Runtime Error') {
        finalStatus = 'Runtime Error';
        finalError = result.error || 'Runtime error occurred';
        break;
      }

      const cmp = compareOutput(result.output, expectedOutput);
      if (cmp.passed) {
        passedCount++;
      } else {
        finalStatus = 'Wrong Answer';
        finalOutput = result.output || '';
        finalError = `Test ${i + 1}: expected "${cmp.normalizedExpected}", got "${cmp.normalizedActual}"`;
        break;
      }
    }

    if (passedCount === hiddenTests.length) {
      finalStatus = 'Accepted';
      finalOutput = 'All tests passed!';
      finalError = '';
    }

    const submission = new Submission({
      problemId,
      code,
      language,
      status: finalStatus,
      testsPassed: passedCount,
      totalTests: hiddenTests.length,
      output: finalOutput,
      error: finalError,
      executionTime: maxTime
    });
    await submission.save();

    if (finalStatus === 'Accepted' && req.session && req.session.userId) {
      try {
        const user = await User.findById(req.session.userId);
        if (user && !user.solvedProblems.includes(problemId)) {
          user.solvedProblems.push(problemId);
          const diff = problem.difficulty.toLowerCase();
          if (diff === 'easy') user.counts.easy += 1;
          else if (diff === 'medium') user.counts.medium += 1;
          else if (diff === 'hard') user.counts.hard += 1;
          await user.save();
        }
      } catch (trackErr) {
        console.error('Failed to track solved problem:', trackErr.message);
      }
    }

    res.json({
      submissionId: submission._id,
      status: finalStatus,
      testsPassed: passedCount,
      totalTests: hiddenTests.length,
      output: finalOutput,
      error: finalError,
      executionTime: maxTime
    });
  } catch (error) {
    console.error('Submit error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

router.get('/:submissionId', async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.submissionId).lean();
    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }
    res.json(submission);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;