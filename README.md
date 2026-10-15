# Lander Call Center CRM

A full-stack call center and lead management platform built with:

- **Frontend**: Next.js 14 + React.js (App Router, JSX only)
- **Backend**: Node.js + Express.js (REST API)
- **Database**: Supabase (PostgreSQL + Auth + RLS + Realtime + Storage)
- **UI**: Tailwind CSS + Lucide Icons + Recharts
- **Forms**: React Hook Form + Zod validation
- **Testing**: Vitest (unit/integration) + Playwright (E2E)

## Project Structure

```
lander-call-center/
├── frontend/          # Next.js 14 App Router application
├── backend/           # Express.js REST API
├── supabase/          # SQL migrations, seed data, config
├── docs/              # Architecture, SRS, API, deployment docs
├── .github/           # CI/CD workflows
└── README.md
```

## Quick Start

### Prerequisites
- Node.js 18+
- npm 9+
- Supabase CLI (`npm install -g supabase`)
- A Supabase project (cloud or local)

### 1. Clone and install

```bash
git clone <repo-url>
cd lander-call-center

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### 2. Configure environment variables

```bash
# Backend
cp backend/.env.example backend/.env
# Fill in SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, JWT_SECRET, PORT

# Frontend
cp frontend/.env.example frontend/.env.local
# Fill in NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, NEXT_PUBLIC_API_URL
```

### 3. Run Supabase migrations

```bash
cd supabase
supabase db push
# or for local dev:
supabase start
supabase db reset
```

### 4. Start development servers

```bash
# Terminal 1 — Backend API (port 4000)
cd backend && npm run dev

# Terminal 2 — Frontend (port 3000)
cd frontend && npm run dev
```

### 5. Open the app

Visit [http://localhost:3000](http://localhost:3000)

## Roles

| Role | Description |
|------|-------------|
| Super Admin | Platform-wide administration |
| Business Admin | Organization management |
| Call Center Manager | Operations & team management |
| Supervisor | Agent monitoring & coaching |
| Agent | Lead handling & calling |
| CRM Manager | Lead import & distribution |
| QA Officer | Call review & scoring |
| Reporting Analyst | Analytics & exports |
| Auditor | Read-only audit logs |
| Integration Admin | Telephony & webhook config |

## Documentation

- [Software Requirements Specification](docs/SRS.md)
- [Architecture](docs/architecture.md)
- [Database ERD](docs/database-erd.md)
- [Permissions Matrix](docs/permissions.md)
- [REST API Reference](docs/API.md)
- [Deployment Guide](docs/deployment.md)

## License

Proprietary — All rights reserved.
