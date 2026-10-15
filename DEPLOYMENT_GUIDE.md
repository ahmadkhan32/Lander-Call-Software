# Lander Call Software - Deployment & Project Guide

## 1. GitHub Push Status (100% Synced)
- **Target Repository**: `https://github.com/ahmadkhan32/Lander-Call-Software.git`
- **Branch**: `main`
- **Frontend Stack**: **React.js + Vite + Tailwind CSS** (JavaScript/JSX only, zero TypeScript)
- **Backend Stack**: **Node.js + Express.js REST API**
- **Database**: **Supabase (PostgreSQL + Auth + RLS)**
- **Total Operational Routes**: 24+ public and protected routes inside responsive AppShell with MobileNav

---

## 2. Deploying the Vite SPA to Vercel (`lander-call-softwarees.vercel.app`)

Because the frontend is built with **Vite** (not Next.js), Vercel must build using the **Vite Framework Preset** and output to **`dist`**.

### Recommended Step-by-Step Vercel Deployment:

1. Open your Vercel Project Dashboard: **[vercel.com/dashboard](https://vercel.com/dashboard)**.
2. Select your project **`lander-call-softwarees`**.
3. Go to **Settings** → **General**:
   - **Framework Preset**: Select **`Vite`** (or leave as detected).
   - **Root Directory**: Click **Edit**, enter **`frontend`**, and click **Save**.
   - **Build Command**: `npm run build` (or `vite build`).
   - **Output Directory**: `dist`.
4. Go to the **Deployments** tab:
   - Click the three dots `...` on the latest deployment from the `main` branch.
   - Click **Redeploy** (ensure "Use existing Build Cache" is unchecked).
5. Vercel will install dependencies, run `vite build`, and publish your SPA to **`https://lander-call-softwarees.vercel.app/`**.

> **Note on Root Builds**: If Root Directory in Vercel is kept as `./`, the root `package.json` build script automatically builds `frontend/` and mirrors `dist/` directly into the root folder. Both configurations are supported.

---

## 3. CORS Configuration Summary

| Component | File | Configuration |
|---|---|---|
| **Backend Express API** | `backend/src/app.js` | Allows `*.vercel.app`, `localhost:3000`, `127.0.0.1`, wildcard `*`, credentials, pre-flight `OPTIONS` caching, and helmet cross-origin resource policy. |
| **Backend Environment** | `backend/src/config/index.js` | Configurable comma-separated `ALLOWED_ORIGINS` with automatic wildcard fallback. |
| **Next.js Frontend** | `frontend/next.config.js` | Custom response headers for `/api/:path*` enabling CORS methods, credentials, and allowed headers. |
| **Vercel Edge Config** | `vercel.json` | Vercel platform-level CORS headers for cross-origin API calls. |

---

## 4. UI/UX Architecture & Responsive Layout

All 26 pages are responsive across Mobile (<768px), Tablet (768px - 1023px), and Desktop (≥1024px):

```
lander-call-center/
├── frontend/
│   ├── app/
│   │   ├── (auth)/             # Login, Register, Forgot Password, Reset Password
│   │   ├── dashboard/          # KPI Cards, Analytics Charts, Live Activities
│   │   ├── leads/              # Lead table, Filters, Lead details, New lead form
│   │   ├── dialer/             # Interactive Softphone Dialer & Call status
│   │   ├── calls/              # Call logs, recordings player, disposition filter
│   │   ├── campaigns/          # Campaign progress & target metrics
│   │   ├── contacts/           # Contact directory & quick actions
│   │   ├── follow-ups/         # Follow-up schedule & reminder alerts
│   │   ├── agents/ & teams/    # Agent availability & team management
│   │   ├── quality-assurance/  # Call scoring & QA audit logs
│   │   ├── reports/            # Conversion reports & performance metrics
│   │   ├── settings/           # Roles, Profile, System preferences
│   │   └── globals.css         # Tailwind tokens & smooth micro-animations
│   └── components/
│       ├── layout/             # Responsive AppShell, Sidebar, Topbar
│       └── SoftphoneDialer.jsx # Global floating dialer with DTMF key tones
├── backend/                    # Express REST API (12/12 Vitest tests passing)
└── supabase/                   # 9 SQL migrations & seed data
```
