# Lander Call Center CRM — Permissions & RBAC Matrix

## 1. Overview

Lander Call Center CRM implements a multi-tenant Role-Based Access Control (RBAC) model. Permissions are defined at the granular action level (`<resource>.<action>`) and associated to users through their organization-assigned roles.

---

## 2. Platform Roles

| Role | Code / Name | Description |
|------|-------------|-------------|
| **Super Admin** | `Super Admin` | System-wide administrative operations across all tenants |
| **Business Admin** | `Business Admin` | Organization owner; full access to tenant data and billing |
| **Call Center Manager** | `Call Center Manager` | Operations manager overseeing teams, campaigns, and routing |
| **Supervisor** | `Supervisor` | Team lead monitoring live agents, assigning leads, and coaching |
| **Agent** | `Agent` | Frontline caller handling leads, dialing, and follow-ups |
| **CRM Manager** | `CRM Manager` | Ingestion, lead scrubbing, deduplication, and campaign setup |
| **QA Officer** | `QA Officer` | Quality assurance reviewing call recordings and scoring |
| **Reporting Analyst** | `Reporting Analyst` | Read-only analytics, KPI dashboards, and data exports |
| **Auditor** | `Auditor` | Compliance auditor with immutable audit log access |
| **Integration Admin** | `Integration Admin` | Manages telephony webhooks and third-party API integrations |

---

## 3. Permissions Matrix

| Permission Key | Description | Super Admin | Business Admin | Manager | Supervisor | Agent | QA | Analyst | Auditor |
|----------------|-------------|:-----------:|:--------------:|:-------:|:----------:|:-----:|:--:|:-------:|:-------:|
| `org.manage` | Update organization settings | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `users.read` | View users and agents | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `users.create` | Invite / provision new users | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `users.update` | Update user status and roles | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `leads.read` | View lead records | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `leads.create` | Create new leads | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| `leads.update` | Edit lead details | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| `leads.assign` | Route and reassign leads | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| `leads.archive` | Archive / soft-delete leads | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `calls.read` | View call records and logs | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `calls.initiate` | Dial outbound calls | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| `calls.update` | Update call disposition & notes | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| `campaigns.read` | View campaigns | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `campaigns.manage`| Create/pause/edit campaigns | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `follow_ups.read` | View follow-ups | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| `follow_ups.manage`| Create & complete follow-ups | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| `reports.view` | View KPI dashboards & charts | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ |
| `reports.export` | Export CSV/Excel data | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ |
| `audit.read` | View immutable audit logs | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| `telephony.manage` | Update telephony provider keys | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

---

## 4. Enforcement Mechanism

Permissions are enforced at two distinct boundaries:
1. **Frontend App Router**: Navigation links and action buttons check user permissions (`user.permissions.includes('leads.create')`).
2. **Backend API**: The Express middleware `requirePermission('<permission_key>')` queries user permissions loaded from `user_roles` and rejects unauthorized requests with HTTP `403 Forbidden`.
