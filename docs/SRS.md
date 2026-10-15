# Software Requirements Specification (SRS)
# Lander Call Center CRM

**Version:** 1.0  
**Date:** 2026-10-14  
**Status:** Draft

---

## 1. Introduction

### 1.1 Purpose
This SRS defines the functional and non-functional requirements for the Lander Call Center CRM platform — a multi-tenant, role-based call center and lead management system.

### 1.2 Scope
The system enables organizations to manage leads, conduct outbound/inbound calling campaigns, track call outcomes, schedule follow-ups, and analyze performance. It integrates with a real telephony provider through a provider-agnostic adapter.

### 1.3 Definitions

| Term | Definition |
|------|-----------|
| Organization | A tenant — a company or team using the platform |
| Lead | A prospective customer being contacted by the call center |
| Agent | A call center representative who handles leads and calls |
| Campaign | A structured calling effort targeting a list of leads |
| Disposition | The recorded outcome of a call |
| Follow-up | A scheduled callback or task for an agent |
| RLS | Row Level Security — database-level access control in PostgreSQL |
| RBAC | Role-Based Access Control — permission system based on user roles |

---

## 2. System Overview

### 2.1 Technology Stack
- **Frontend:** Next.js 14 (App Router), React 18, Tailwind CSS, Recharts, React Hook Form + Zod
- **Backend:** Node.js, Express.js (REST API)
- **Database:** Supabase (PostgreSQL, Auth, RLS, Realtime, Storage)
- **Language:** JavaScript + JSX only (no TypeScript)
- **Testing:** Vitest (unit/integration), Playwright (E2E)
- **CI/CD:** GitHub Actions

### 2.2 Architecture
Modular monolith with:
- Frontend presentation layer (Next.js)
- Backend API layer (Express)
- Service + repository layers
- Supabase as the single database platform

---

## 3. Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-01 | Authentication via Supabase Auth (sign-in, sign-out, session refresh) | Must |
| FR-02 | Multi-tenant organization management with strict data isolation | Must |
| FR-03 | User provisioning, role assignment, and profile management | Must |
| FR-04 | Full CRUD for lead records with search, filter, and pagination | Must |
| FR-05 | Customer CRM with contact history and duplicate detection | Should |
| FR-06 | Campaign creation, lead list attachment, and result tracking | Must |
| FR-07 | Call log creation with direction, outcome, duration, disposition | Must |
| FR-08 | Telephony integration via provider-agnostic adapter | Must |
| FR-09 | Agent availability tracking (available/busy/break/offline) | Should |
| FR-10 | Follow-up scheduling with reminders and overdue detection | Must |
| FR-11 | QA review system with scorecards | Should |
| FR-12 | Dashboard and analytical reports | Must |
| FR-13 | Immutable audit logging for all important actions | Must |
| FR-14 | In-app, email, and SMS notifications | Should |
| FR-15 | Data integrity: FK, constraints, transactions, migrations | Must |
| FR-16 | Idempotent webhook processing with deduplication | Must |

---

## 4. Non-Functional Requirements

| ID | Category | Target |
|----|----------|--------|
| NFR-01 | Performance | API p95 ≤ 500ms under agreed test load |
| NFR-02 | Availability | 99.5% monthly uptime |
| NFR-03 | Security | HTTPS, RBAC, RLS, rate limiting, no secrets in client |
| NFR-04 | Tenant isolation | Zero cross-org data leakage |
| NFR-05 | Data integrity | All FK + constraint violations rejected |
| NFR-06 | Scalability | Load-tested for agreed concurrent users |
| NFR-07 | Accessibility | WCAG 2.2 AA for core workflows |
| NFR-08 | Maintainability | Modular code, documented APIs, automated tests |
| NFR-09 | Code standard | JS/JSX only, ESLint, consistent naming |

---

## 5. User Stories (Sample)

**Authentication**
- As an agent, I want to sign in with email/password so I can access my dashboard.
- As a manager, I want expired sessions to redirect to login so security is maintained.

**Leads**
- As an agent, I want to search leads by name or phone so I can find contacts quickly.
- As a CRM manager, I want to bulk-import a CSV of leads so I can populate a campaign.
- As a supervisor, I want to reassign a lead from one agent to another.

**Calls**
- As an agent, I want to log a call outcome with a disposition code.
- As a manager, I want to see call duration and talk time per agent per day.

**Follow-ups**
- As an agent, I want a reminder notification 30 minutes before a callback is due.
- As a supervisor, I want to see all overdue follow-ups across my team.

**Reports**
- As a manager, I want a bar chart of calls per agent per week.
- As an analyst, I want to export a CSV of campaign call results.
