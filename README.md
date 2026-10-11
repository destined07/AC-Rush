# AC-Rush - Competitive Programming Platform

A web-based platform for solving algorithmic coding problems with real-time code execution, AI-powered hints, and code explanations.

## Features

- Browse and filter coding problems by difficulty, category, and tags
- Code editor supporting Python, C++, and Java
- Real-time code execution via OneCompiler
- AI-powered hints and code explanations via OpenRouter
- User authentication with profile and progress tracking
- Admin panel for managing problems and viewing submissions
- Dark theme UI

## Tech Stack

- **Backend**: Node.js + Express.js
- **Database**: MongoDB
- **Views**: EJS
- **Code Execution**: OneCompiler API
- **AI**: OpenRouter API
- **Styling**: CSS3

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env` file:
   ```
   MONGODB_URI=mongodb://localhost:27017/algoforge
   ONECOMPILER_KEY=your_onecompiler_api_key
   OPENROUTER_KEY=your_openrouter_api_key
   OPENROUTER_MODEL=openai/gpt-4o-mini
   SESSION_SECRET=your_session_secret
   PORT=3000
   ```

3. Start the server:
   ```bash
   npm run dev
   ```

4. Seed problems (optional):
   ```bash
   node scripts/seedProblems.js
   ```

## Admin Access

Default admin credentials: `admin` / `admin`

Admin panel: `http://localhost:3000/admin/login`
