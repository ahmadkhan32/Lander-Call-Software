# Lander Call Software - Deployment & Project Guide

## 1. GitHub Push Status (100% Synced)
- **Target Repository**: `https://github.com/ahmadkhan32/Lander-Call-Software.git`
- **Branch**: `main`
- **Latest Commit**: `36d3108` (`fix(vercel): standardize build command, root next.config.mjs, and brand assets for automatic Vercel deployment`)
- **Total Static & Dynamic Routes**: 49 routes fully implemented and compiling with 0 errors
- **Local Git Status**: Fully staged, committed, and pushed directly to `origin/main`.

---

## 2. Fixing Vercel `404: DEPLOYMENT_NOT_FOUND` & `No Next.js version detected`

The `DEPLOYMENT_NOT_FOUND` error occurs because previous deployments failed on Vercel with *"No Next.js version detected"* when the root directory did not match where Next.js was installed.

### How to complete the Vercel deployment:

#### Method A: Setting Root Directory to `frontend` in Vercel (Recommended)
1. Open your Vercel Project Dashboard: **[vercel.com/dashboard](https://vercel.com/dashboard)**.
2. Select your project **`lander-call-softwarees`**.
3. Go to **Settings** → **General**.
4. Scroll to **Root Directory** and click **Edit**.
5. Type `frontend` (or click Select and pick the `frontend` folder).
6. Click **Save**.
7. Go to the **Deployments** tab, click the three dots `...` on the latest deployment, and click **Redeploy**.

#### Method B: Automatic Root Build (Commit `36d3108`)
The latest commit `36d3108` already configured root `package.json`, root `next.config.mjs`, and root `vercel.json` so that if Vercel builds from the repository root:
- Root `package.json` contains `"next": "^14.2.21"` in `dependencies` (resolving the *"No Next.js version detected"* check).
- The root build script automatically builds `frontend/`, and mirrors `.next` and `public` directly to `./.next` and `./public`.
- Simply trigger a **Redeploy** from the **Deployments** tab in Vercel.

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
