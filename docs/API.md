# REST API Reference
# Lander Call Center CRM Backend

**Base URL:** `http://localhost:4000` (dev) / `https://api.yourdomain.com` (prod)  
**Authentication:** All endpoints require `Authorization: Bearer <supabase-jwt>` unless noted.  
**Content-Type:** `application/json`

---

## Authentication
Handled entirely by Supabase Auth on the frontend. The backend validates the JWT on every protected request.

---

## Common Response Shapes

**Success:**
```json
{ "success": true, "data": { ... }, "pagination": { ... } }
```

**Error:**
```json
{ "success": false, "error": "Human-readable message" }
```

**HTTP Status Codes:**
| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Validation error |
| 401 | Not authenticated |
| 403 | Insufficient permissions |
| 404 | Resource not found |
| 429 | Rate limit exceeded |
| 500 | Server error |

---

## Pagination

All list endpoints support:
- `?page=1` (default: 1)
- `?limit=20` (default: 20, max: 100)

Response includes: `{ page, limit, total, pages }`

---

## Leads — `/api/leads`

### GET /api/leads
List leads with optional filters.

**Permission:** `leads.read`

**Query params:**
| Param | Type | Description |
|-------|------|-------------|
| search | string | Search name, phone, email |
| status | string | Filter by status |
| assigned_agent_id | uuid | Filter by agent |
| campaign_id | uuid | Filter by campaign |
| order_by | string | Field to sort by (default: created_at) |
| order | string | asc / desc |

**Response:** `{ leads: [...], pagination: {...} }`

---

### GET /api/leads/:id
Get a single lead with related agent, campaign, and source.

**Permission:** `leads.read`

---

### POST /api/leads
Create a new lead.

**Permission:** `leads.create`

**Body:**
```json
{
  "full_name": "Jane Doe",
  "phone": "+1 555 000 0001",
  "email": "jane@example.com",
  "company": "Acme Corp",
  "priority": "medium",
  "campaign_id": "uuid",
  "notes": "Interested in Plan B"
}
```

---

### PATCH /api/leads/:id
Update a lead (partial).

**Permission:** `leads.update`

---

### DELETE /api/leads/:id
Archive a lead (sets status = archived, does not delete).

**Permission:** `leads.archive`

---

### POST /api/leads/:id/assign
Assign a lead to an agent in the same organization.

**Permission:** `leads.assign`

**Body:** `{ "agent_id": "uuid" }`

---

### GET /api/leads/:id/calls
Get call history for a specific lead.

**Permission:** `calls.read`

---

## Calls — `/api/calls`

### GET /api/calls
List calls with filters.

**Permission:** `calls.read`

**Query params:** agent_id, lead_id, campaign_id, direction, status, start_date, end_date

---

### POST /api/calls
Log a new call.

**Permission:** `calls.initiate`

**Body:**
```json
{
  "lead_id": "uuid",
  "direction": "outbound",
  "phone_to": "+1 555 000 0001",
  "provider": "twilio",
  "provider_call_id": "CA..."
}
```

---

### PATCH /api/calls/:id
Update a call (status, disposition, duration, notes).

**Permission:** `calls.update`

---

## Campaigns — `/api/campaigns`

### GET /api/campaigns
### GET /api/campaigns/:id
### POST /api/campaigns
### PATCH /api/campaigns/:id
### DELETE /api/campaigns/:id  _(archive)_

**Permission:** `campaigns.manage` for write operations.

---

## Follow-ups — `/api/follow-ups`

### GET /api/follow-ups
**Query:** status, assigned_agent_id, overdue=true

### POST /api/follow-ups
```json
{
  "lead_id": "uuid",
  "type": "callback",
  "priority": "high",
  "due_at": "2026-10-20T10:00:00Z",
  "notes": "Promised to call back after meeting"
}
```

### PATCH /api/follow-ups/:id
### DELETE /api/follow-ups/:id  _(cancel)_

---

## Users — `/api/users`

### GET /api/users
### GET /api/users/:id
### GET /api/users/me
### PATCH /api/users/:id
### POST /api/users/:id/roles
```json
{ "role_name": "agent" }
```

---

## Reports — `/api/reports`

### GET /api/reports/overview
Returns: `{ total_leads, calls_last_7d, overdue_follow_ups }`

### GET /api/reports/agents
**Query:** start_date, end_date, agent_id

### GET /api/reports/campaigns
**Query:** start_date, end_date

---

## Webhooks — `/api/webhooks`

### POST /api/webhooks/telephony
Receives telephony provider events. **No JWT required** — validates using `X-Webhook-Signature` header instead.

**Idempotent:** Duplicate `provider + event_id` combinations are detected and acknowledged without re-processing.

**Body example (generic):**
```json
{
  "provider": "twilio",
  "event_id": "EV123...",
  "event_type": "call.completed",
  "provider_call_id": "CA123...",
  "duration": "120"
}
```

---

## Health Check

### GET /health
No authentication required.

**Response:** `{ "status": "ok", "timestamp": "...", "service": "lander-backend" }`
