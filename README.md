# WorkBoard

**Your team's work, beautifully organized.**

WorkBoard is a premium, production-quality project & task management SaaS
application. It includes a full dashboard, Kanban boards, project timelines,
team management, analytics, notifications, and an AI productivity assistant —
all backed by a real MySQL-powered API.

## Tech Stack

**Frontend:** React, Vite, Tailwind CSS, React Router, Axios, Lucide React, Recharts, React Hook Form, Zod, Framer Motion

**Backend:** Node.js, Express, MySQL (mysql2), JWT, bcrypt, Helmet, CORS, express-rate-limit

**Infrastructure:** Docker, Docker Compose, Nginx

## Project Structure

```
workboard/
├── frontend/          React + Vite + Tailwind SPA
│   └── Dockerfile
├── backend/            Express + MySQL REST API
│   ├── src/
│   │   └── config/db.js   pool + auto schema creation
│   └── Dockerfile
├── database/            MySQL schema reference (docs only)
│   ├── schema.sql
│   └── README.md
├── docker-compose.yml
├── .env.example
└── README.md
```

- **Database:** MySQL 8.4
- **Frontend:** http://localhost:8070
- **Backend API:** http://localhost:5431
- Frontend `/api/*` requests are reverse-proxied by Nginx to the backend.
- Database tables are created automatically on backend startup — no manual
  migration step needed (see `database/README.md` if you want the raw SQL).

## Running Locally with Docker (recommended)

1. Copy the environment file and set a real JWT secret:
   ```bash
   cp .env.example .env
   # edit .env and set JWT_SECRET to a long random string
   ```
2. Build and start everything:
   ```bash
   docker compose up --build -d
   ```
3. Confirm everything is healthy:
   ```bash
   docker compose ps
   curl http://localhost:5431/api/health
   ```
4. Open the app:
   ```
   http://localhost:8070
   ```

To stop everything:
```bash
docker compose down
```

To stop everything **and** wipe the database volume (fresh start):
```bash
docker compose down -v
```

MySQL runs in its own container and is **not** exposed to the host — only the
backend can reach it over the internal Docker network.

## Running Without Docker (development)

**Backend**
```bash
cd backend
npm install
cp ../.env.example .env   # edit as needed, needs a running MySQL instance
npm run dev
```

**Frontend**
```bash
cd frontend
npm install
npm run dev
```

The Vite dev server proxies nothing by default — set `VITE_API_URL` in
`frontend/.env` to point at your backend (e.g. `http://localhost:5431/api`)
if you're not running behind the Nginx container.

## Core Features

- **Dashboard** — live stats (total/in-progress/completed/overdue tasks), a productivity trend chart with 7/30/90-day ranges, a task-status donut chart, active project cards, and recent tasks
- **My Tasks** — filterable task list with inline complete, quick actions, and a detail drawer
- **Projects** — create projects, track progress, and open a project workspace with Overview / Board / Tasks / Timeline tabs
- **Kanban Board** — drag-and-drop across To Do / In Progress / Completed / Blocked, with status persisted immediately
- **Team** — see teammates, their task and project counts, and invite new members
- **Analytics** — completion rate, average completion time, overdue count, status/priority breakdowns, and per-project progress
- **AI Assistant** — a chat-style workspace assistant; the AI call is abstracted behind `backend/src/services/aiService.js` so you can plug in a real provider by setting `AI_PROVIDER` / `AI_API_KEY`
- **Notifications** — task-assignment notifications with read/unread state
- **Settings** — profile, appearance (light/dark), notification preferences

## Security Notes

- Passwords are hashed with bcrypt; sessions use JWTs (7-day expiry)
- Helmet, CORS, and rate limiting are enabled on the API
- Request bodies are validated with `express-validator`
- Never commit your real `.env` file, JWT secret, or database credentials

## What's Simplified for This Build

This is a portfolio-scale build of the full 49-point spec. A few things were kept intentionally lean so the whole system stays runnable end-to-end:

- The AI assistant uses a rule-based fallback reply unless you wire up a real provider in `aiService.js`
- "Invite Member" and a few settings toggles are UI-only (no email invite flow or persisted notification preferences yet)
- No automated test suite is included

Everything else — auth, projects, tasks, dashboard, analytics, notifications, and the Kanban board — is fully wired to the real API and MySQL, with no hardcoded or fake data.
