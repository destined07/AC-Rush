import express from 'express';
import axios from 'axios';
import Problem from '../models/Problem.js';

const router = express.Router();
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const OPENROUTER_KEY = process.env.OPENROUTER_KEY;
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || 'openai/gpt-4o-mini';

async function queryOpenRouter(prompt) {
  if (!OPENROUTER_KEY) {
    throw new Error('OPENROUTER_KEY is not configured');
  }

  const response = await axios.post(
    OPENROUTER_URL,
    {
      model: OPENROUTER_MODEL,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.4
    },
    {
      headers: {
        Authorization: `Bearer ${OPENROUTER_KEY}`,
        'Content-Type': 'application/json'
      }
    }
  );

  return response.data?.choices?.[0]?.message?.content?.trim() || '';
}

router.post('/hint', async (req, res) => {
  try {
    const { problemId } = req.body;

    if (!problemId) {
      return res.status(400).json({ error: 'Problem ID required' });
    }

    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }

    const prompt = `You are a helpful coding tutor. Provide a helpful hint for solving this programming problem.

Problem Title: ${problem.title}

Problem Description:
${problem.description}

Constraints:
${problem.constraints}

Provide a brief hint that guides the user toward solving this problem without giving away the solution. Focus on the approach or algorithm they should consider.`;

    const hint = await queryOpenRouter(prompt);

    res.json({ hint });
  } catch (error) {
    console.error('AI Hint error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/explain', async (req, res) => {
  try {
    const { problemId, code, language } = req.body;

    if (!problemId || !code) {
      return res.status(400).json({ error: 'Problem ID and code required' });
    }

    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }

    const prompt = `You are a helpful coding tutor. Explain the following code solution for this programming problem.

Problem Title: ${problem.title}

Problem Description:
${problem.description}

Language: ${language}

Code:
${code}

Provide a clear, step-by-step explanation of how this code works and how it solves the problem. Explain any key algorithms or data structures used.`;

    const explanation = await queryOpenRouter(prompt);

    res.json({ explanation });
  } catch (error) {
    console.error('AI Explain error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
