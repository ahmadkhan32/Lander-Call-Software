# Lander Call Center CRM — Production Deployment Guide

## 1. Prerequisites

- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **Supabase Account**: Cloud project or self-hosted Supabase instance
- **Telephony Provider**: Twilio Account (Account SID, Auth Token, Outbound Voice Phone Number)
- **Domain & SSL**: Valid FQDN with TLS certificate for API and webhooks

---

## 2. Environment Variables Specification

### 2.1 Backend (`backend/.env`)

```ini
PORT=4000
NODE_ENV=production

# Supabase Secrets (Backend uses Service Role Key)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJh... (never expose to client)
SUPABASE_JWT_SECRET=your-jwt-secret-from-supabase-settings

# CORS Whitelist (Frontend Origin)
CORS_ORIGIN=https://crm.yourdomain.com

# Telephony Configuration
TELEPHONY_PROVIDER=twilio
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_FROM_NUMBER=+15551234567
TELEPHONY_WEBHOOK_SECRET=your_webhook_hmac_secret

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

### 2.2 Frontend (`frontend/.env.local`)

```ini
# Supabase Public Keys (Subject to RLS)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJh... (public anonymous key)

# Backend REST API
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

---

## 3. Database Migration Deployment

Deploy database migrations in sequential numerical order:

```bash
cd supabase
supabase link --project-ref your-project-ref
supabase db push
```

Alternatively, execute the migrations in your Supabase SQL Editor in exact order:
1. `001_extensions_and_organizations.sql`
2. `002_profiles_roles_permissions.sql`
3. `003_teams.sql`
4. `004_customers.sql`
5. `005_campaigns_and_leads.sql`
6. `006_calls_and_recordings.sql`
7. `007_follow_ups.sql`
8. `008_qa_and_audit.sql`
9. `009_rls_policies.sql`
10. `seed.sql` (Initial demo data)

---

## 4. Backend Deployment (Docker / Node)

### 4.1 Production Dockerfile (`backend/Dockerfile`)

```dockerfile
FROM node:20-alpine AS runner
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY src/ ./src/
ENV NODE_ENV=production
EXPOSE 4000
CMD ["node", "src/server.js"]
```

### 4.2 Process Management (PM2)

```bash
cd backend
npm install -g pm2
pm2 start src/server.js --name lander-backend -i max
pm2 save
```

---

## 5. Frontend Deployment (Vercel / Node)

### 5.1 Vercel Deployment

1. Connect the GitHub repository to Vercel.
2. Set Root Directory to `frontend`.
3. Add Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_API_URL`
4. Deploy with Framework Preset: Next.js.

### 5.2 Standalone Node Deployment

```bash
cd frontend
npm run build
npm run start -p 3000
```

---

## 6. Telephony Webhook Configuration

In Twilio Console -> Phone Numbers -> Active Numbers -> Voice Configuration:
- **A CALL COMES IN**: Webhook `https://api.yourdomain.com/api/webhooks/telephony` (HTTP POST)
- **STATUS CALLBACK URL**: `https://api.yourdomain.com/api/webhooks/telephony` (HTTP POST)
- **CALLBACK EVENTS**: `initiated, ringing, answered, completed`

All events are idempotently stored and deduplicated in the `webhook_events` table before async processing.
