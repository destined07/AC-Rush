# AC-Rush — Complete Project Guide

> **Your name:** Soham
> **Project:** AC-Rush — A Competitive Programming Platform
> **Read this before your presentation. You'll be able to answer anything.**

---

## 1. What is AC-Rush?

AC-Rush is a **web-based competitive programming platform** (like LeetCode/HackerRank) where users can:
- Browse coding problems by difficulty and category
- Write code in **Python, C++, or Java**
- Run code with custom input
- Submit code that gets tested against hidden test cases
- Get **AI-powered hints** and **code explanations**
- Track their progress on a profile page

It also has an **admin panel** to manage problems and view submissions.

---

## 2. Tech Stack (What Technologies Are Used)

| Layer | Technology | Why? |
|-------|-----------|------|
| **Backend** | Node.js + Express.js | Fast, JavaScript-based server framework |
| **Database** | MongoDB (via Mongoose) | NoSQL database, stores problems/users/submissions |
| **Frontend/Views** | EJS (Embedded JavaScript) | Server-side templating — HTML pages rendered on server |
| **Code Execution** | OneCompiler API | Runs user code in Python/C++/Java remotely |
| **AI Features** | OpenRouter API (GPT-4o-mini) | Generates hints and code explanations |
| **Authentication** | express-session + bcryptjs | Session-based login, passwords are hashed |
| **Styling** | CSS3 | Dark theme, responsive design |

---

## 3. Project Architecture (How It All Fits Together)

```
User's Browser
      │
      ▼
┌──────────────────────────────┐
│      Express.js Server       │  ← server.js (entry point)
│                              │
│  ┌─────────┐  ┌───────────┐ │
│  │  Routes  │  │   Views   │ │
│  │ (API)    │  │  (EJS)    │ │
│  └────┬─────┘  └───────────┘ │
│       │                      │
│  ┌────▼─────┐                │
│  │  Models  │  ← Mongoose    │
│  └────┬─────┘                │
└───────┼──────────────────────┘
        │
        ▼
┌──────────────┐   ┌─────────────────┐   ┌──────────────┐
│   MongoDB    │   │ OneCompiler API  │   │ OpenRouter   │
│  (Database)  │   │ (Code Execution) │   │  (AI/GPT)    │
└──────────────┘   └─────────────────┘   └──────────────┘
```

### Flow in simple words:
1. User opens the site → Express serves an EJS page (HTML)
2. User interacts (clicks, types) → Browser sends API requests to Express routes
3. Routes talk to MongoDB (to get/save data) or external APIs (OneCompiler/OpenRouter)
4. Response comes back → Browser updates the page

---

## 4. File Structure Explained

```
AC-Rush/
├── server.js              ← Main entry point, starts everything
├── package.json           ← Project config, dependencies list
├── .env                   ← Secret keys (DB URL, API keys)
│
├── models/                ← Database schemas (structure of data)
│   ├── Problem.js         ← Problem schema
│   ├── Submission.js      ← Submission schema
│   ├── User.js            ← User schema (with password hashing)
│   └── Admin.js           ← Admin schema
│
├── routes/                ← API endpoints (handle requests)
│   ├── problems.js        ← GET problems list, single problem
│   ├── submissions.js     ← POST run code, submit code
│   ├── ai.js              ← POST get hint, explain code
│   ├── auth.js            ← POST signup, login, logout
│   └── admin.js           ← Admin dashboard, CRUD problems
│
├── utils/                 ← Helper functions
│   ├── onecompiler.js     ← Sends code to OneCompiler API
│   └── outputCompare.js   ← Compares expected vs actual output
│
├── views/                 ← EJS templates (HTML pages)
│   ├── index.ejs          ← Homepage (problem list)
│   ├── problem.ejs        ← Problem page (editor + submit)
│   ├── login.ejs          ← Login page
│   ├── signup.ejs         ← Signup page
│   ├── profile.ejs        ← User profile
│   ├── about.ejs          ← About page
│   ├── contact.ejs        ← Contact page
│   ├── 404.ejs            ← Not found page
│   ├── 500.ejs            ← Error page
│   └── admin/             ← Admin panel pages
│
├── public/                ← Static files (CSS, images)
│   └── styles.css         ← Main stylesheet
│
└── scripts/
    └── seedProblems.js    ← Seeds database with 23 problems
```

---

## 5. How the Server Starts (server.js)

When you run `node server.js`, this happens in order:

1. **Load dependencies** — Express, Mongoose, dotenv, etc.
2. **Configure middleware** — JSON parsing, static files, sessions
3. **Connect to MongoDB** — Using the URI from `.env`
4. **Auto-seed** — If no problems exist in DB, insert 23 default problems
5. **Create default admin** — Username: `admin`, Password: `admin`
6. **Register routes** — Mount all API routes at their paths
7. **Start listening** — On port 3000 (or next available port)

---

## 6. Database Models (How Data is Stored)

### 6.1 Problem Model
Stores coding problems in MongoDB.

| Field | Type | Purpose |
|-------|------|---------|
| `title` | String | Problem name (unique) |
| `description` | String | Full problem statement |
| `difficulty` | String | "Easy", "Medium", or "Hard" |
| `category` | String | e.g., "Arrays", "Strings", "Math" |
| `tags` | [String] | Tags like "Hash Table", "Two Pointers" |
| `constraints` | String | Input constraints |
| `examples` | [TestCase] | Visible test cases (shown to user) |
| `hiddenTestCases` | [TestCase] | Hidden test cases (used during submit) |
| `starterCode` | Object | Template code for Python, C++, Java |
| `checkerCode` | String | Optional custom checker |
| `createdAt` | Date | When problem was created |

Each **TestCase** has: `input` (String), `output` (String), `isExample` (Boolean)

### 6.2 User Model
Stores registered users.

| Field | Type | Purpose |
|-------|------|---------|
| `username` | String | Unique username (3-30 chars) |
| `email` | String | Unique email |
| `password` | String | Hashed password (bcrypt) |
| `solvedProblems` | [ObjectId] | References to solved Problems |
| `counts` | Object | `{ easy: 0, medium: 0, hard: 0 }` |
| `createdAt` | Date | Registration date |

**Important:** Passwords are **never stored in plain text**. Before saving, a `pre('save')` hook automatically hashes the password using bcrypt with salt rounds = 10.

### 6.3 Submission Model
Stores every code submission.

| Field | Type | Purpose |
|-------|------|---------|
| `problemId` | ObjectId | Which problem was submitted |
| `code` | String | The submitted code |
| `language` | String | "python", "cpp", or "java" |
| `status` | String | "Accepted", "Wrong Answer", "Runtime Error", "Compilation Error" |
| `testsPassed` | Number | How many hidden tests passed |
| `totalTests` | Number | Total hidden test count |
| `output` | String | Execution output |
| `error` | String | Error message (if any) |
| `executionTime` | Number | Time taken (seconds) |

### 6.4 Admin Model
Stores admin accounts (separate from regular users).

| Field | Type | Purpose |
|-------|------|---------|
| `username` | String | Admin username |
| `passwordHash` | String | Hashed password |

---

## 7. All API Routes Explained

### 7.1 Problem Routes (`/api/problems`)

#### `GET /api/problems`
- **What it does:** Returns a list of ALL problems
- **What it returns:** Array of `{ _id, title, difficulty, category, tags }`
- **Used by:** Homepage to display the problem list
- **Note:** Does NOT return full description or test cases (keeps response small)

#### `GET /api/problems/:id`
- **What it does:** Returns full details of ONE problem
- **What it returns:** Everything about the problem EXCEPT `hiddenTestCases`
- **Used by:** Problem page to show description, examples, starter code
- **Security:** Hidden test cases are deleted from response so users can't cheat

#### `GET /api/problems/:id/starter/:language`
- **What it does:** Returns starter code for a specific language
- **What it returns:** `{ starter: "code template..." }`
- **Used by:** Code editor when user switches language

#### `GET /api/problems/:id/examples`
- **What it does:** Returns example test cases only
- **What it returns:** `{ examples: [...] }`

---

### 7.2 Submission Routes (`/api/submissions`)

#### `POST /api/submissions/run`
- **What it does:** Runs user's code with custom input (does NOT judge)
- **Request body:** `{ code, language, input }`
- **What it returns:** `{ status, output, error, executionTime }`
- **Flow:**
  1. Receives code + language + stdin input
  2. Sends to OneCompiler API
  3. Returns raw output to user
- **Used by:** "Run" button on problem page

#### `POST /api/submissions/submit`
- **What it does:** Judges code against ALL hidden test cases
- **Request body:** `{ problemId, code, language }`
- **What it returns:** `{ status, testsPassed, totalTests, error }`
- **Flow:**
  1. Fetch the problem from DB (including hidden test cases)
  2. Loop through each hidden test case:
     - Send code + test input to OneCompiler
     - Compare output with expected output
     - If mismatch → "Wrong Answer", stop
     - If error → "Runtime Error" or "Compilation Error", stop
  3. If all pass → "Accepted"
  4. Save submission to DB
  5. If Accepted + user is logged in → add problem to user's `solvedProblems`
- **Used by:** "Submit" button on problem page

#### `GET /api/submissions/:submissionId`
- **What it does:** Returns details of a specific submission
- **Used by:** Admin panel

---

### 7.3 AI Routes (`/api/ai`)

#### `POST /api/ai/hint`
- **What it does:** Gets an AI-generated hint for a problem
- **Request body:** `{ problemId }`
- **Flow:**
  1. Fetch problem from DB
  2. Build a prompt: "Give a hint for this problem: [title + description + constraints]"
  3. Send prompt to OpenRouter API (GPT-4o-mini)
  4. Return the AI response
- **Used by:** "Get Hint" button on problem page

#### `POST /api/ai/explain`
- **What it does:** Gets AI explanation of user's code
- **Request body:** `{ problemId, code, language }`
- **Flow:**
  1. Fetch problem from DB
  2. Build a prompt: "Explain this code for this problem: [problem + code]"
  3. Send to OpenRouter API
  4. Return explanation
- **Used by:** "Explain Code" button on problem page

---

### 7.4 Auth Routes (`/auth`)

#### `POST /auth/signup`
- **Request body:** `{ username, email, password }`
- **Validations:** username ≥ 3 chars, password ≥ 6 chars, no duplicates
- **Flow:**
  1. Check if username/email already exists
  2. Create new User (password auto-hashed by mongoose pre-save hook)
  3. Set session: `req.session.userId` and `req.session.username`
  4. Return success

#### `POST /auth/login`
- **Request body:** `{ identifier, password }`
- **Flow:**
  1. Find user by username OR email
  2. Compare password using bcrypt
  3. If match → set session, return success
  4. If no match → return "Invalid credentials"

#### `GET /auth/logout`
- Destroys the session, redirects to homepage

#### `GET /auth/me`
- Returns current logged-in user's info (or `null` if not logged in)
- Used by frontend to show/hide login buttons

---

### 7.5 Admin Routes (`/admin`)

All admin routes (except login) require `req.session.adminId` to be set.

| Route | Method | What it does |
|-------|--------|-------------|
| `/admin/login` | GET | Shows admin login page |
| `/admin/login` | POST | Authenticates admin |
| `/admin/logout` | GET | Destroys session |
| `/admin/dashboard` | GET | Shows all problems + stats |
| `/admin/add-problem` | GET | Shows "add problem" form |
| `/admin/add-problem` | POST | Creates new problem in DB |
| `/admin/edit-problem/:id` | GET | Shows edit form for a problem |
| `/admin/edit-problem/:id` | POST | Updates problem in DB |
| `/admin/delete-problem/:id` | POST | Deletes problem from DB |
| `/admin/submissions` | GET | Shows recent 50 submissions |

---

## 8. Code Execution — How It Works

This is the most important part to understand:

```
User writes code → clicks "Submit"
       │
       ▼
Browser sends POST /api/submissions/submit
       │
       ▼
Server fetches hidden test cases from MongoDB
       │
       ▼
For EACH test case:
  ┌─────────────────────────────────────┐
  │ Send to OneCompiler API:            │
  │   - source code                     │
  │   - language (python/cpp/java)      │
  │   - stdin (test input)              │
  │                                     │
  │ OneCompiler runs it and returns:    │
  │   - stdout (program output)         │
  │   - stderr (errors if any)          │
  │   - exception (runtime errors)      │
  └──────────────┬──────────────────────┘
                 │
                 ▼
  Compare actual output vs expected output
  (using normalizeOutput — trims whitespace, normalizes newlines)
       │
       ├── Match → continue to next test
       └── Mismatch → "Wrong Answer", stop
       
All tests pass → "Accepted" ✅
```

### OneCompiler API Call (utils/onecompiler.js):
- **Endpoint:** `https://api.onecompiler.com/v1/run`
- **Method:** POST
- **Body:** `{ language, stdin, files: [{ name, content }] }`
- **Auth:** API key in `X-API-Key` header
- **Response:** `{ stdout, stderr, exception, status }`

### Output Comparison (utils/outputCompare.js):
- Normalizes both outputs: trims trailing whitespace per line, normalizes `\r\n` to `\n`, trims overall
- Then does exact string comparison
- This prevents false "Wrong Answer" from extra spaces/newlines

---

## 9. Authentication — How It Works

### Password Security:
1. User signs up with plain text password
2. **Before saving to DB**, Mongoose `pre('save')` hook runs
3. Hook uses `bcryptjs.genSalt(10)` to generate a random salt
4. Then `bcryptjs.hash(password, salt)` creates the hash
5. Only the **hash** is stored in MongoDB — never the plain password

### Session Management:
- Uses `express-session` middleware
- When user logs in successfully, server sets:
  - `req.session.userId` = user's MongoDB `_id`
  - `req.session.username` = user's username
- Session is stored server-side (in memory by default)
- Browser gets a session cookie (just an ID, no sensitive data)
- On every request, Express checks the cookie → loads the session
- Session expires after 24 hours

### Login Flow:
```
User enters username + password
       │
       ▼
Server finds user in DB by username/email
       │
       ▼
bcrypt.compare(entered_password, stored_hash)
       │
       ├── true → Set session, redirect to home
       └── false → "Invalid credentials"
```

---

## 10. AI Integration — How It Works

Uses **OpenRouter API** which provides access to various AI models.

### Configuration:
- `OPENROUTER_KEY` — API key from openrouter.ai
- `OPENROUTER_MODEL` — defaults to `openai/gpt-4o-mini`

### How a hint request works:
1. Frontend sends `POST /api/ai/hint` with `{ problemId }`
2. Server fetches problem details from MongoDB
3. Server builds a **prompt**:
   ```
   You are a helpful coding tutor. Provide a helpful hint...
   Problem Title: Two Sum
   Description: Given an array...
   Constraints: 2 <= nums.length <= 10^4
   ```
4. Sends this prompt to OpenRouter API as a chat completion request
5. OpenRouter forwards to GPT-4o-mini, gets response
6. Server returns the AI text to frontend

### API Call Structure:
- **URL:** `https://openrouter.ai/api/v1/chat/completions`
- **Headers:** `Authorization: Bearer <key>`
- **Body:** `{ model, messages: [{ role: "user", content: prompt }], temperature: 0.4 }`

---

## 11. Key Concepts for Viva Questions

### Q: What is Node.js?
**A:** Node.js is a JavaScript runtime that lets you run JavaScript on the server (outside the browser). It uses Chrome's V8 engine and is great for building fast, scalable web servers.

### Q: What is Express.js?
**A:** Express is a minimal web framework for Node.js. It handles routing (mapping URLs to functions), middleware (processing requests), and serving responses.

### Q: What is MongoDB?
**A:** MongoDB is a NoSQL database that stores data as JSON-like documents (called BSON). Unlike SQL databases with tables/rows, MongoDB uses collections/documents. It's flexible — no fixed schema required.

### Q: What is Mongoose?
**A:** Mongoose is an ODM (Object Data Modeling) library for MongoDB and Node.js. It lets you define schemas (structure of documents), validate data, and interact with MongoDB using JavaScript objects.

### Q: What is EJS?
**A:** EJS (Embedded JavaScript) is a templating engine. It lets you write HTML pages with dynamic JavaScript code inside `<%= %>` tags. The server renders the final HTML and sends it to the browser.

### Q: What is REST API?
**A:** REST (Representational State Transfer) is a way to design APIs. It uses HTTP methods:
- GET = retrieve data
- POST = create/send data
- PUT/PATCH = update data
- DELETE = remove data

### Q: How are passwords stored securely?
**A:** Passwords are hashed using bcrypt before storing. Bcrypt adds a random "salt" and runs the password through a one-way hash function. Even if the database is leaked, no one can reverse the hash to get the original password.

### Q: What is a session?
**A:** A session is temporary server-side storage linked to a specific user. When a user logs in, the server creates a session with their info. The browser gets a session ID cookie. On each request, the server uses this ID to identify the user.

### Q: How does code execution work without running code on your server?
**A:** We use OneCompiler's API — a third-party service. We send the user's code, language, and input to their servers via HTTP. They compile and run it in a sandboxed environment and return the output. This is safer than running untrusted code on our own server.

### Q: What is middleware in Express?
**A:** Middleware is a function that runs between receiving a request and sending a response. Examples in our project:
- `express.json()` — parses JSON request bodies
- `express.session()` — manages user sessions
- `requireAdmin` — checks if user is an admin before allowing access

### Q: What is the difference between Run and Submit?
**A:** 
- **Run** — Executes code with user-provided input, returns raw output. No judging.
- **Submit** — Executes code against all hidden test cases, compares outputs, gives verdict (Accepted/Wrong Answer/etc.), saves to database.

### Q: Why are test cases hidden?
**A:** Hidden test cases prevent cheating. If users could see all test cases, they could hardcode answers instead of writing a real algorithm. Only example test cases are visible for understanding the problem format.

### Q: What is the `.env` file?
**A:** The `.env` file stores environment variables — secret values like API keys, database URLs, and session secrets. It's never committed to Git (listed in `.gitignore`). The `dotenv` package loads these values into `process.env`.

### Q: What design pattern does this project follow?
**A:** **MVC (Model-View-Controller)**:
- **Model** — `models/` folder (database schemas)
- **View** — `views/` folder (EJS templates)
- **Controller** — `routes/` folder (business logic)

### Q: How does the project seed default problems?
**A:** In `server.js`, after connecting to MongoDB, it checks `Problem.countDocuments()`. If count is 0 (empty database), it inserts 23 problems from `scripts/seedProblems.js`. You can also manually run `node scripts/seedProblems.js` to reset and reseed.

### Q: What happens when a user solves a problem?
**A:** When a submission gets "Accepted":
1. The problem ID is added to the user's `solvedProblems` array
2. The difficulty counter (`counts.easy/medium/hard`) is incremented
3. This data shows on the user's profile page

### Q: What external APIs does this project use?
**A:** Two:
1. **OneCompiler API** — For compiling and running code in Python/C++/Java
2. **OpenRouter API** — For AI-powered hints and code explanations (uses GPT-4o-mini)

---

## 12. Quick Command Reference

| Command | What it does |
|---------|-------------|
| `npm install` | Install all dependencies |
| `npm run dev` | Start server with auto-reload (nodemon) |
| `npm start` | Start server (production) |
| `node scripts/seedProblems.js` | Reset & seed 23 problems in DB |

---

**You've got this, Soham! 💪🚀**
