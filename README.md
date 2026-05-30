# A1 Learner v1.0.0

A1 Learner is a premium, production-ready AI-powered learning platform designed for engineering students in India. It offers structured roadmaps for Data Structures & Algorithms (DSA), Full Stack Web Development, AI/ML, and Cybersecurity, alongside a Markdown study notes vault and a Gemini-powered AI Tutor chat interface.

---

## Technical Architecture

The codebase is organized as a unified full-stack monorepo:
* **`/backend`**: Express.js server, Mongoose (MongoDB) database schema models, security rate-limiting middlewares, JWT sessions, and route controllers.
* **`/frontend`**: Next.js 15 App Router client built with TypeScript, Tailwind CSS, Framer Motion, Zustand, and React Query.

```
├── backend/
│   ├── config/          # DB connection setups
│   ├── controllers/     # API request handlers (Auth, Notes, AI, Roadmaps)
│   ├── middleware/      # JWT security & global error interceptors
│   ├── models/          # MongoDB Atlas schemas (User, Note, Roadmap, Progress, Chat)
│   ├── routes/          # REST API endpoints mapping
│   └── server.js        # Express main entrypoint
├── frontend/
│   ├── src/
│   │   ├── app/         # Next.js App Router (Landing, Dashboard, Notes, AI, Profile)
│   │   ├── components/  # Sticky Navbar and Custom Glassmorphic UI Primitives
│   │   ├── services/    # REST API Client with token auto-refresh rotation
│   │   └── store/       # Zustand session states
│   ├── package.json
│   └── tailwind.config.ts
├── package.json         # Unified monorepo dev scripts
├── server.js            # Entry redirect proxy
└── .env.example
```

---

## Core Product Capabilities

1. **Authentication System**: Register/Login forms validated with Zod schemas. Employs dual JWT tokens (Access token and Refresh token rotation), secure cookie structures, and simulated Google OAuth verification.
2. **Landing Page**: Visually stunning dark-tech SaaS design featuring animated landing components, floating cards, real-time counters, client testimonials, and sticky headers.
3. **Student Dashboard**: Streak tracking, experience milestones (XP), daily quest checkboxes, and custom interactive SVG charts indicating study hours and weekly progress.
4. **Interactive Roadmaps**: Accompanying syllabi for DSA, Web Dev, AI/ML, and Cybersecurity. Tracks completed topics with progress loaders, offers code references, and awards XP milestones.
5. **Notes Workspace**: Side-by-side editing panel featuring search, category filters, and automatic debounced API sync saves (auto-save indicators).
6. **A1 AI Tutor**: An IDE-like chatbot interface integrated with the Google Gemini SDK. Offers prompt suggestions (Concept explainer, quiz generator, code models) and auto-saves thread histories. Implements a rule-based CS tutorial fallback engine when offline.
7. **Profile Dashboard**: Achievement achievements tracker displaying unlocked badges (e.g. Recursion Wizard, Stack Ninja) on XP checkpoints.
8. **Admin Panel**: Role-Based Access Control allowing administrators to oversee student registrations, review global note categorization statistics, and toggle administrator privileges.

---

## Setup & Local Installation

### Prerequisites
* Node.js (v18 or higher)
* MongoDB (Local instance or MongoDB Atlas Connection URI)

### Installation
1. Clone the project and navigate to the folder:
   ```bash
   cd A1_learner_new
   ```
2. Install unified dependencies:
   ```bash
   npm install
   ```
3. Initialize the frontend client dependencies:
   ```bash
   cd frontend
   npm install
   cd ..
   ```

### Configuration
Create a `.env` file in the root directory:
```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
MONGODB_URI=mongodb://localhost:27017/a1_learner
JWT_SECRET=your_jwt_access_secret_key
JWT_EXPIRE=30m
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key
JWT_REFRESH_EXPIRE=7d
GEMINI_API_KEY=your_google_gemini_api_key
```

### Running Locally
To launch both the Express API server (on port 5000) and the Next.js client (on port 3000) concurrently:
```bash
npm run dev
```

---

## REST API Reference

| Endpoint | Method | Security | Description |
| :--- | :--- | :--- | :--- |
| `/api/auth/register` | POST | Public | Register user & get session |
| `/api/auth/login` | POST | Public | Log in user & set cookies |
| `/api/auth/google` | POST | Public | OAuth Google verification |
| `/api/auth/refresh` | POST | Public | Rotate JWT Access Token |
| `/api/auth/profile` | GET/PUT | Private | Manage user stats & name |
| `/api/notes` | GET/POST | Private | Fetch notes & add new file |
| `/api/notes/:id` | PUT/DELETE | Private | Auto-save edits / Delete file |
| `/api/roadmaps` | GET | Private | Seed & view learning roadmaps |
| `/api/roadmaps/:id` | GET | Private | Fetch syllabus with progress |
| `/api/roadmaps/complete-topic`| POST | Private | Complete topic & reward XP |
| `/api/ai/chat` | POST | Private | Interact with AI tutor |
| `/api/admin/users` | GET | Admin | List registered accounts |
| `/api/admin/analytics` | GET | Admin | Fetch system health stats |

---

## Security Framework

* **JWT Rotations**: Short-lived access tokens combined with HTTP-only Refresh cookie sessions.
* **Helmet.js**: Implements custom header security policies against MIME/sniffing attacks.
* **Mongo Sanitization**: Protects routes against NoSQL injection queries.
* **Rate Limiter**: Caps spam requests per client IP to 300 hits per 15 mins.
* **bcryptjs**: Solid password hashes (salt factor 10) preventing raw storage.

---

## Deployment Playbook

### Backend (Render / Heroku)
1. Set up a Web Service on Render linking to your Git repository.
2. In the Render Dashboard, add Environment Variables from your `.env` (ensure `NODE_ENV` is set to `production`).
3. Set the **Build Command** to `npm install` and the **Start Command** to `node backend/server.js`.

### Frontend (Vercel)
1. Create a project on Vercel and import the repository.
2. Configure the root directory to `frontend`.
3. In Project Settings, set the Build Command to `npm run build` and Output Directory to `.next`.
4. In Vercel Environment Variables, set `NEXT_PUBLIC_API_URL` to your Render API URL (e.g. `https://a1-learner-api.onrender.com/api`).
