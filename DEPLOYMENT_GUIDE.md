# Lander Call Software - Deployment & Project Guide

## 1. GitHub Push Status
- **Target Repository**: `https://github.com/ahmadkhan32/Lander-Call-Software.git`
- **Branch**: `main`
- **Total Files Committed**: 157 files (27,700+ lines of code)
- **Local Git Status**: Fully staged and committed cleanly with zero pending changes.

### Complete the GitHub Push in 1 Click:
An interactive command prompt window has been opened on your desktop. If you see the GitHub login popup:
1. Click **Sign in with your browser**.
2. GitHub will authorize the push and upload all files.

*(Alternatively, you can double-click `push_to_github.bat` in the project folder at any time).*

---

## 2. Vercel Deployment Configuration

The repository is pre-configured with root and frontend `vercel.json` files so it deploys seamlessly to Vercel.

### Step-by-Step Vercel Setup:
1. Go to **[vercel.com/new](https://vercel.com/new)** and sign in with GitHub.
2. Under **Import Git Repository**, choose **`ahmadkhan32/Lander-Call-Software`**.
3. Configure the project settings:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend` (or leave default root `./`)
   - **Build Command**: `next build` (or root build script)
4. Add your **Environment Variables**:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   NEXT_PUBLIC_API_URL=https://your-backend-api-url.com
   ```
5. Click **Deploy**.

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
