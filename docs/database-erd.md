# Lander Call Center CRM — Database Entity Relationship Diagram (ERD)

## 1. Overview

The database layer runs on PostgreSQL hosted via Supabase. It uses 15 core relational tables with strict foreign key integrity, check constraints, default UUID primary keys, and comprehensive Row Level Security policies.

---

## 2. Mermaid Entity-Relationship Diagram

```mermaid
erDiagram
    ORGANIZATIONS ||--o{ PROFILES : employs
    ORGANIZATIONS ||--o{ TEAMS : organizes
    ORGANIZATIONS ||--o{ CUSTOMERS : owns
    ORGANIZATIONS ||--o{ CAMPAIGNS : runs
    ORGANIZATIONS ||--o{ LEADS : manages
    ORGANIZATIONS ||--o{ CALLS : logs
    ORGANIZATIONS ||--o{ FOLLOW_UPS : schedules
    ORGANIZATIONS ||--o{ AUDIT_LOGS : records

    PROFILES ||--o{ USER_ROLES : has
    ROLES ||--o{ USER_ROLES : assigned_to
    ROLES ||--o{ ROLE_PERMISSIONS : defines
    PERMISSIONS ||--o{ ROLE_PERMISSIONS : grants

    TEAMS ||--o{ TEAM_MEMBERS : includes
    PROFILES ||--o{ TEAM_MEMBERS : belongs_to

    CAMPAIGNS ||--o{ LEADS : targets
    LEAD_SOURCES ||--o{ LEADS : generates
    PROFILES ||--o{ LEADS : assigned_to
    CUSTOMERS ||--o{ LEADS : associates

    LEADS ||--o{ CALLS : receives
    PROFILES ||--o{ CALLS : conducts
    CAMPAIGNS ||--o{ CALLS : tracks
    CALL_DISPOSITIONS ||--o{ CALLS : categorizes
    CALLS ||--o{ CALL_RECORDINGS : stores

    LEADS ||--o{ FOLLOW_UPS : targets
    CALLS ||--o{ FOLLOW_UPS : triggers
    PROFILES ||--o{ FOLLOW_UPS : assigned_to

    ORGANIZATIONS {
        uuid id PK
        varchar name
        varchar slug UK
        varchar status
        varchar plan
        timestamp created_at
    }

    PROFILES {
        uuid id PK "references auth.users"
        uuid organization_id FK
        varchar full_name
        varchar phone
        varchar status "active, busy, away, inactive"
        varchar timezone
        timestamp created_at
    }

    ROLES {
        uuid id PK
        varchar name UK
        varchar description
    }

    PERMISSIONS {
        uuid id PK
        varchar permission_key UK
        varchar module
        varchar description
    }

    TEAMS {
        uuid id PK
        uuid organization_id FK
        varchar name
        varchar description
        uuid team_lead_id FK
    }

    LEADS {
        uuid id PK
        uuid organization_id FK
        varchar full_name
        varchar phone
        varchar email
        varchar status "new, contacted, qualified, converted, lost, archived"
        varchar priority "low, medium, high, urgent"
        uuid assigned_agent_id FK
        uuid campaign_id FK
        uuid source_id FK
        jsonb custom_fields
        timestamp last_contacted_at
        timestamp created_at
    }

    CALLS {
        uuid id PK
        uuid organization_id FK
        uuid agent_id FK
        uuid lead_id FK
        uuid campaign_id FK
        varchar direction "inbound, outbound"
        varchar phone_from
        varchar phone_to
        varchar status "initiated, ringing, in_progress, completed, failed, no_answer, busy, cancelled"
        varchar provider "mock, twilio"
        varchar provider_call_id
        integer duration_seconds
        integer talk_time_seconds
        uuid disposition_id FK
        text notes
        timestamp started_at
        timestamp ended_at
    }

    FOLLOW_UPS {
        uuid id PK
        uuid organization_id FK
        uuid lead_id FK
        uuid call_id FK
        uuid assigned_agent_id FK
        varchar type "callback, email, meeting, task, other"
        varchar status "pending, completed, cancelled, overdue"
        varchar priority "low, medium, high, urgent"
        timestamp due_at
        text notes
        timestamp completed_at
    }

    AUDIT_LOGS {
        uuid id PK
        uuid organization_id FK
        uuid actor_id FK
        varchar action
        varchar resource_type
        uuid resource_id
        jsonb old_value
        jsonb new_value
        inet ip_address
        timestamp created_at
    }

    WEBHOOK_EVENTS {
        uuid id PK
        varchar provider
        varchar event_id
        varchar event_type
        jsonb payload
        varchar status "received, processing, processed, duplicate, failed"
        timestamp created_at
    }
```
