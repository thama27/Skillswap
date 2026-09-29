# SkillSwap AI 🚀
### *An Intelligent Skill Exchange and Career Recommendation Platform*

> **Empowering Collaborative Learning Through AI-Based Skill Matching and Certification**

SkillSwap AI is a full-stack platform designed to connect learners and mentors for peer-to-peer knowledge sharing, smart AI compatibility matching, live mentorship scheduling, career trajectory roadmapping, and verifiable skill credentialing.

---

## 🌟 Key Features

- 🎯 **Intelligent Skill Matching**: Algorithmic compatibility scoring based on skill complementarity, shared interests, proficiency gaps, and availability overlap.
- 👥 **Peer Mentorship Network**: Discover mentors and learners, connect with 1-click requests, and collaborate across technical domains.
- 📅 **Session Management**: Schedule, track, and manage 1-on-1 mentorship sessions with automated meeting links.
- 🧭 **AI Career Recommendation**: Tailored career pathways, skill gap identification, salary ranges, and structured growth roadmaps based on user profiles.
- 🎓 **Verifiable Credentials**: Cryptographically signed certificates with unique verification codes and instant PDF/text export.
- 🔐 **Enterprise Security & Auth**: Supabase Auth integration, PostgreSQL Row-Level Security (RLS), and JWT-scoped API access.

---

## 🏗️ Architecture & Tech Stack

### Frontend
- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Custom Dark Theme
- **Icons**: Lucide React
- **State & Auth**: Supabase Auth + Context API

### Backend API
- **Runtime**: Node.js + Express.js (ES Modules)
- **Database**: PostgreSQL on Supabase
- **Security**: JWT Bearer verification + Row Level Security (RLS)

---

## 📂 Project Structure

```
skillswap-ai/
├── src/                      # Frontend React Application
│   ├── components/           # Reusable UI components
│   ├── contexts/             # Auth and global state
│   ├── lib/                  # Supabase client setup
│   ├── pages/                # Application views (Dashboard, SkillMatch, Sessions, etc.)
│   ├── services/             # API client and domain services
│   └── types/                # TypeScript interface definitions
├── server/                   # Backend Express Server
│   └── src/
│       ├── config/           # Supabase client & environment configuration
│       ├── middleware/       # JWT auth & error handling middleware
│       ├── routes/           # REST API routes (profile, skills, matches, sessions, career)
│       └── index.js          # Express app entrypoint
├── public/                   # Static assets
├── .env.example              # Frontend environment variables template
├── server/.env.example       # Backend environment variables template
├── package.json              # Frontend dependencies and scripts
└── vite.config.ts            # Vite build configuration
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn
- Supabase Project ([supabase.com](https://supabase.com))

### 1. Clone the Repository
```bash
git clone https://github.com/thama27/Skillswap.git
cd Skillswap
```

### 2. Configure Environment Variables

**Frontend (`.env.local`):**
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
```

**Backend (`server/.env`):**
```env
PORT=5000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-publishable-key
CLIENT_URL=http://localhost:5173
```

### 3. Install Dependencies & Run Locally

**Run Backend:**
```bash
cd server
npm install
npm start
```
*Backend runs on `http://localhost:5000` with health check at `/api/health`.*

**Run Frontend:**
```bash
# In the root directory
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173`.*

---

## 🚢 Deployment Guide

### Deploying Frontend (Vercel / Netlify)
1. Import repository on **Vercel** or **Netlify**.
2. Root Directory: `./` (or leave default).
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Configure Environment Variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`

### Deploying Backend (Render / Railway / Fly.io)
1. Deploy from the `server/` directory as a Node web service.
2. Build Command: `npm install`
3. Start Command: `npm start`
4. Configure Environment Variables:
   - `PORT=5000`
   - `SUPABASE_URL`
   - `SUPABASE_KEY`
   - `CLIENT_URL` (URL of your deployed frontend)

---

## 📄 License
MIT License. Built for the SkillSwap AI community.
