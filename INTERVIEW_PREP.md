# AC-Rush / AlgoForge — System Architecture & Interview Preparation Guide

A crisp, high-yield walkthrough of the codebase architecture, design decisions, data flow, and trade-offs. Tailored for technical interviews.

---

## 1. High-Level Overview

**AC-Rush** is a full-stack competitive programming platform (LeetCode alternative) built with **Node.js, Express, MongoDB (Mongoose), and EJS**. 

### Core Value Proposition
- Problem discovery with filtering (difficulty, category, tags).
- Multi-language in-browser coding environment (Python, C++, Java).
- Real-time remote code compilation and test-case execution via **OneCompiler API**.
- AI-powered assistance (hints and step-by-step code explanations) using **OpenRouter API** (`gpt-4o-mini`).
- **Stateless JWT Authentication** with secure HTTP-only cookies.
- Admin dashboard for CRUD on problems, test cases (examples + hidden test cases), and submission audits.

---

## 2. Architecture & Tech Stack

| Layer | Technology | Role & Why Chosen |
|---|---|---|
| **Runtime / Server** | Node.js (ES Modules), Express.js | Event-driven I/O, REST endpoints, SSR template delivery. |
| **Authentication** | JSON Web Tokens (`jsonwebtoken`), `cookie-parser` | **Stateless**, horizontally scalable auth; stored in `HttpOnly`, `SameSite` cookies to prevent XSS. |
| **Database** | MongoDB with Mongoose ODM | Flexible document schema for variable problem descriptions, constraints, examples, and test cases. |
| **View Engine** | EJS (Embedded JavaScript) | Server-Side Rendering (SSR) for fast initial page load and SEO. |
| **Remote Code Runner** | OneCompiler API | Sandboxed, isolated multi-language code execution without maintaining an in-house Docker cluster. |
| **AI Integration** | OpenRouter API (`gpt-4o-mini`) | Generates context-aware hints and code explanations based on problem descriptions and submitted code. |

---

## 3. Directory Structure & Key Modules

```
AC-Rush-master/
├── models/
│   ├── User.js             # User credentials, solvedProblems array, difficulty counts
│   ├── Admin.js            # Admin credentials & bcrypt compare
│   ├── Problem.js          # Problem statement, test cases (examples & hidden), starter code
│   └── Submission.js       # Submission record (status, output, testsPassed, runtime)
├── routes/
│   ├── auth.js             # /auth/signup, /auth/login, /auth/logout, /auth/me
│   ├── admin.js            # /admin/login, /admin/dashboard, add/edit/delete problems
│   ├── problems.js         # /api/problems (list, details, starter code, sanitized examples)
│   ├── submissions.js      # /api/submissions/run, /api/submissions/submit
│   └── ai.js               # /api/ai/hint, /api/ai/explain
├── utils/
│   ├── jwt.js              # Token signing, verification, cookie extraction, middleware
│   ├── onecompiler.js      # OneCompiler API client & response normalizer
│   └── outputCompare.js    # Multi-line stdout normalizer (trims whitespace, \r\n handling)
├── views/                  # EJS templates (index, problem, profile, admin/*)
├── scripts/
│   └── seedProblems.js     # Initial problem database seed data
└── server.js               # Express app bootstrap, DB connection, routing
```

---

## 4. Deep-Dive: Authentication (Stateful vs. Stateless JWT)

### Why Stateless JWT over Stateful Sessions?
- **Stateful (Previous)**: Relied on server-side memory (`express-session`). In a multi-instance or serverless setup, sessions require a shared store (like Redis), risking memory leaks or session loss on restarts.
- **Stateless (Current)**:
  - When user logs in/signs up, server signs a JWT containing `{ userId, username, email }` with `JWT_SECRET`.
  - Token is transmitted in a **`HttpOnly`, `SameSite=lax` cookie** (`auth_token`).
  - Every incoming request parses the cookie via `cookieParser()` and validates the signature via `attachUserFromToken` middleware.
  - No database lookup is strictly required to verify identity; any server instance can verify the user instantly.

### Security Defenses
- **`HttpOnly`**: JavaScript (`document.cookie`) cannot read the token, neutralizing standard XSS credential theft.
- **`SameSite: lax`**: Protects against Cross-Site Request Forgery (CSRF).
- **`secure: process.env.NODE_ENV === 'production'`**: Transmitted only over HTTPS in production.
- **Role Isolation**: Dedicated `admin_token` cookie and separate verification for admin routes (`requireAdmin`).

---

## 5. End-to-End Workflow / Request Lifecycles

### Flow A: User Authentication
```
Client (Browser)
   │
   ├─► POST /auth/login { identifier, password }
   │      │
   │      ├─► Find user in MongoDB (by username or email)
   │      ├─► Compare password hash via bcryptjs
   │      ├─► Sign JWT payload: { userId, username, email }
   │      └─► Set-Cookie: auth_token=<jwt>; HttpOnly; SameSite=lax; Max-Age=1d
   │
   └─◄ 200 OK { success: true, user: { ... } }
```

### Flow B: Running Code vs. Submitting Solution
```
Client clicks "Run"
   │
   └─► POST /api/submissions/run { problemId, code, language, stdin }
          │
          ├─► Fetch problem examples from DB
          ├─► Call OneCompiler API with user code and input
          └─◄ Return stdout / stderr / executionTime

Client clicks "Submit"
   │
   └─► POST /api/submissions/submit { problemId, code, language }
          │
          ├─► Fetch problem's hidden test cases + custom checker if any
          ├─► Sequential evaluation through OneCompiler
          │     ├─ For each test case: run -> compare output using outputCompare.js
          │     └─ Stop early on first failure (Wrong Answer, TLE, etc.)
          ├─► Persist Submission record in MongoDB
          ├─► If Accepted & user is authenticated (via req.user):
          │     └─ Add problemId to user.solvedProblems & increment difficulty count
          └─◄ Return final verdict (Accepted / Wrong Answer / etc.)
```

### Flow C: AI Hint & Code Explanation
```
Client clicks "Get Hint" / "Explain Code"
   │
   └─► POST /api/ai/hint or /api/ai/explain { problemId, code?, language? }
          │
          ├─► Fetch problem details (title, description, constraints)
          ├─► Build structured prompt instructing LLM to act as a coding tutor
          ├─► Post payload to OpenRouter API (gpt-4o-mini)
          └─◄ Stream / return response back to client
```

---

## 6. Likely Interview Questions & Model Answers

### Q1: Why did you migrate from `express-session` to JWT in cookies?
> **Answer**: `express-session` by default uses MemoryStore, which cannot scale horizontally across multiple instances and causes memory leaks in production. Switching to stateless JWT eliminates server-side session state, making horizontal scaling and containerization trivial. By storing the JWT in an `HttpOnly`, `SameSite` cookie rather than `localStorage`, we maintain security against XSS while keeping the client implementation simple.

### Q2: How are test cases secured so users cannot cheat?
> **Answer**: In `routes/problems.js`, the endpoint `/api/problems/:id` explicitly removes the `hiddenTestCases` field (`delete problem.hiddenTestCases`) before returning the problem JSON to the frontend. The hidden test cases only live on the server and are evaluated server-side in `routes/submissions.js`.

### Q3: How do you handle non-deterministic or whitespace-heavy outputs from compilers?
> **Answer**: `utils/outputCompare.js` implements `normalizeOutput()`, which strips carriage returns (`\r\n` to `\n`), trims trailing whitespace per line, and trims overall boundaries before strict equality checking.

### Q4: What are the trade-offs of using OneCompiler's API instead of building an internal judge?
> **Answer**:
> - **Pros**: Zero infrastructure overhead for sandboxing (no need for root privileges, Docker-in-Docker, or seccomp/cgroup configurations). Fast multi-language support.
> - **Cons**: External network latency, potential rate limits, dependency on third-party uptime, and per-test-case HTTP request overhead. For higher throughput, an internal judge worker pool with a message queue (e.g., BullMQ + Redis + isolated Docker containers) would be the next evolutionary step.

### Q5: How is authorization separated between standard users and admins?
> **Answer**: We enforce separation of concerns using two isolated tokens and middlewares: `auth_token` for platform problem solvers and `admin_token` for contest administrators. The admin routes are gated by `requireAdmin`, which validates that the verified payload has an active `adminId`.
