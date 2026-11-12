-- ============================================================================
-- LANDER CRM & OPERATIONS PLATFORM - ALL-IN-ONE MASTER SCHEMA & SETUP
-- Run this entire script in Supabase Studio -> SQL Editor
-- Creates all tables, relations, triggers, RLS policies, and RBAC seeds in 1 click!
-- Completely idempotent (safe to run on fresh or existing databases).
-- ============================================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


-- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
-- MIGRATION: 001_extensions_and_organizations.sql
-- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

-- ============================================================
-- Migration: 001_extensions_and_organizations.sql
-- Description: Enable extensions and create organizations table
-- ============================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- ORGANIZATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.organizations (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT        NOT NULL,
  slug        TEXT        NOT NULL UNIQUE,
  status      TEXT        NOT NULL DEFAULT 'active'
                CHECK (status IN ('active', 'suspended', 'archived')),
  plan        TEXT        NOT NULL DEFAULT 'trial'
                CHECK (plan IN ('trial', 'starter', 'professional', 'enterprise')),
  settings    JSONB       NOT NULL DEFAULT '{}',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_organizations_status ON public.organizations(status);

COMMENT ON TABLE public.organizations IS 'Top-level tenant; every resource belongs to an org';

-- ============================================================
-- SUBSCRIPTIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID        NOT NULL REFERENCES public.organizations(id) ON DELETE RESTRICT,
  plan            TEXT        NOT NULL DEFAULT 'trial',
  status          TEXT        NOT NULL DEFAULT 'active'
                    CHECK (status IN ('active', 'cancelled', 'past_due', 'trialing')),
  trial_ends_at   TIMESTAMPTZ,
  current_period_start TIMESTAMPTZ,
  current_period_end   TIMESTAMPTZ,
  external_ref    TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_org ON public.subscriptions(organization_id);

-- auto-update updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_organizations_updated_at
  BEFORE UPDATE ON public.organizations
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
-- MIGRATION: 002_profiles_roles_permissions.sql
-- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

-- ============================================================
-- Migration: 002_profiles_roles_permissions.sql
-- Description: User profiles, roles, permissions, RBAC mapping tables
-- ============================================================

-- ============================================================
-- PROFILES  (extends auth.users)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id              UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE RESTRICT,
  organization_id UUID        NOT NULL REFERENCES public.organizations(id) ON DELETE RESTRICT,
  full_name       TEXT        NOT NULL,
  phone           TEXT,
  avatar_url      TEXT,
  status          TEXT        NOT NULL DEFAULT 'active'
                    CHECK (status IN ('active', 'inactive', 'suspended')),
  timezone        TEXT        NOT NULL DEFAULT 'UTC',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (organization_id, id)
);

CREATE INDEX IF NOT EXISTS idx_profiles_org     ON public.profiles(organization_id);
CREATE INDEX IF NOT EXISTS idx_profiles_status  ON public.profiles(status);

CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- ROLES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.roles (
  id          UUID  PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT  NOT NULL UNIQUE,
  description TEXT
);

INSERT INTO public.roles (name, description) VALUES
  ('super_admin',         'Platform-wide administration'),
  ('business_admin',      'Organization management, users, campaigns'),
  ('call_center_manager', 'Operations, lead distribution, targets'),
  ('supervisor',          'Monitor agents, review calls, reassign leads'),
  ('agent',               'Handle leads, make calls, record outcomes'),
  ('crm_manager',         'Import, validate, deduplicate and distribute leads'),
  ('qa_officer',          'Review call recordings, score quality'),
  ('reporting_analyst',   'View performance reports, export data'),
  ('auditor',             'Read audit logs, investigate changes'),
  ('integration_admin',   'Configure telephony, webhooks, credentials'),
  ('background_worker',   'Process reminders, imports, scheduled tasks');

-- ============================================================
-- PERMISSIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.permissions (
  id             UUID  PRIMARY KEY DEFAULT gen_random_uuid(),
  permission_key TEXT  NOT NULL UNIQUE,
  description    TEXT
);

INSERT INTO public.permissions (permission_key, description) VALUES
  -- Organizations
  ('organizations.manage',          'Create / update / deactivate organizations'),
  -- Users
  ('users.create',                  'Create new users'),
  ('users.read',                    'View user profiles'),
  ('users.update',                  'Edit user profiles'),
  ('users.deactivate',              'Deactivate user accounts'),
  -- Leads
  ('leads.create',                  'Create lead records'),
  ('leads.read',                    'View lead records'),
  ('leads.update',                  'Edit lead records'),
  ('leads.archive',                 'Archive lead records'),
  ('leads.assign',                  'Assign leads to agents'),
  ('leads.import',                  'Bulk-import leads'),
  ('leads.export',                  'Export leads'),
  -- Calls
  ('calls.initiate',                'Start outbound calls'),
  ('calls.read',                    'View call logs'),
  ('calls.update',                  'Edit call records'),
  ('calls.recording.read',          'Listen to call recordings'),
  -- Campaigns
  ('campaigns.manage',              'Create / edit / archive campaigns'),
  -- Follow-ups
  ('follow_ups.manage',             'Create / edit / close follow-ups'),
  -- Reports
  ('reports.view',                  'View performance reports'),
  ('reports.export',                'Export report data'),
  -- Audit
  ('audit_logs.read',               'Read the audit log'),
  -- Settings
  ('settings.manage',               'Change system and organization settings'),
  -- QA
  ('qa_reviews.create',             'Submit QA scorecards'),
  ('qa_reviews.read',               'View QA scorecards'),
  -- Teams
  ('teams.manage',                  'Create / edit / delete teams'),
  -- Integrations
  ('integrations.manage',           'Configure telephony integrations and webhooks');

-- ============================================================
-- USER ↔ ROLE (user may hold multiple roles in the same org)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.user_roles (
  user_id         UUID NOT NULL,
  role_id         UUID NOT NULL REFERENCES public.roles(id)  ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  granted_by      UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  granted_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, role_id, organization_id),
  FOREIGN KEY (organization_id, user_id) REFERENCES public.profiles(organization_id, id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_user_roles_user ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_org  ON public.user_roles(organization_id);

-- ============================================================
-- ROLE ↔ PERMISSION
-- ============================================================
CREATE TABLE IF NOT EXISTS public.role_permissions (
  role_id       UUID NOT NULL REFERENCES public.roles(id)       ON DELETE CASCADE,
  permission_id UUID NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

-- Seed role_permissions
DO $$
DECLARE
  r_super_admin         UUID;
  r_business_admin      UUID;
  r_cc_manager          UUID;
  r_supervisor          UUID;
  r_agent               UUID;
  r_crm_manager         UUID;
  r_qa_officer          UUID;
  r_reporting_analyst   UUID;
  r_auditor             UUID;
  r_integration_admin   UUID;

  all_perms             UUID[];
  perm_id               UUID;
BEGIN
  SELECT id INTO r_super_admin         FROM public.roles WHERE name = 'super_admin';
  SELECT id INTO r_business_admin      FROM public.roles WHERE name = 'business_admin';
  SELECT id INTO r_cc_manager          FROM public.roles WHERE name = 'call_center_manager';
  SELECT id INTO r_supervisor          FROM public.roles WHERE name = 'supervisor';
  SELECT id INTO r_agent               FROM public.roles WHERE name = 'agent';
  SELECT id INTO r_crm_manager         FROM public.roles WHERE name = 'crm_manager';
  SELECT id INTO r_qa_officer          FROM public.roles WHERE name = 'qa_officer';
  SELECT id INTO r_reporting_analyst   FROM public.roles WHERE name = 'reporting_analyst';
  SELECT id INTO r_auditor             FROM public.roles WHERE name = 'auditor';
  SELECT id INTO r_integration_admin   FROM public.roles WHERE name = 'integration_admin';

  -- Super Admin gets every permission
  SELECT ARRAY_AGG(id) INTO all_perms FROM public.permissions;
  FOREACH perm_id IN ARRAY all_perms LOOP
    INSERT INTO public.role_permissions (role_id, permission_id) VALUES (r_super_admin, perm_id)
      ON CONFLICT DO NOTHING;
  END LOOP;

  -- Business Admin
  INSERT INTO public.role_permissions (role_id, permission_id)
  SELECT r_business_admin, id FROM public.permissions
  WHERE permission_key IN (
    'users.create','users.read','users.update','users.deactivate',
    'leads.create','leads.read','leads.update','leads.archive','leads.assign','leads.import','leads.export',
    'calls.read','campaigns.manage','follow_ups.manage',
    'reports.view','reports.export','teams.manage','settings.manage'
  ) ON CONFLICT DO NOTHING;

  -- Call Center Manager
  INSERT INTO public.role_permissions (role_id, permission_id)
  SELECT r_cc_manager, id FROM public.permissions
  WHERE permission_key IN (
    'users.read','leads.read','leads.assign',
    'calls.initiate','calls.read','calls.update',
    'campaigns.manage','follow_ups.manage','reports.view','reports.export','teams.manage'
  ) ON CONFLICT DO NOTHING;

  -- Supervisor
  INSERT INTO public.role_permissions (role_id, permission_id)
  SELECT r_supervisor, id FROM public.permissions
  WHERE permission_key IN (
    'users.read','leads.read','leads.assign',
    'calls.read','calls.recording.read','follow_ups.manage','reports.view','qa_reviews.read'
  ) ON CONFLICT DO NOTHING;

  -- Agent
  INSERT INTO public.role_permissions (role_id, permission_id)
  SELECT r_agent, id FROM public.permissions
  WHERE permission_key IN (
    'leads.read','leads.update',
    'calls.initiate','calls.read','calls.update',
    'follow_ups.manage'
  ) ON CONFLICT DO NOTHING;

  -- CRM Manager
  INSERT INTO public.role_permissions (role_id, permission_id)
  SELECT r_crm_manager, id FROM public.permissions
  WHERE permission_key IN (
    'leads.create','leads.read','leads.update','leads.archive',
    'leads.assign','leads.import','leads.export'
  ) ON CONFLICT DO NOTHING;

  -- QA Officer
  INSERT INTO public.role_permissions (role_id, permission_id)
  SELECT r_qa_officer, id FROM public.permissions
  WHERE permission_key IN (
    'calls.read','calls.recording.read',
    'qa_reviews.create','qa_reviews.read'
  ) ON CONFLICT DO NOTHING;

  -- Reporting Analyst
  INSERT INTO public.role_permissions (role_id, permission_id)
  SELECT r_reporting_analyst, id FROM public.permissions
  WHERE permission_key IN ('reports.view','reports.export')
  ON CONFLICT DO NOTHING;

  -- Auditor
  INSERT INTO public.role_permissions (role_id, permission_id)
  SELECT r_auditor, id FROM public.permissions
  WHERE permission_key IN ('audit_logs.read')
  ON CONFLICT DO NOTHING;

  -- Integration Admin
  INSERT INTO public.role_permissions (role_id, permission_id)
  SELECT r_integration_admin, id FROM public.permissions
  WHERE permission_key IN ('integrations.manage','settings.manage')
  ON CONFLICT DO NOTHING;

END $$;


-- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
-- MIGRATION: 003_teams.sql
-- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

-- ============================================================
-- Migration: 003_teams.sql
-- Description: Teams and team membership
-- ============================================================

CREATE TABLE IF NOT EXISTS public.teams (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID        NOT NULL REFERENCES public.organizations(id) ON DELETE RESTRICT,
  name            TEXT        NOT NULL,
  leader_id       UUID,
  description     TEXT,
  status          TEXT        NOT NULL DEFAULT 'active'
                    CHECK (status IN ('active', 'archived')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (organization_id, name),
  FOREIGN KEY (organization_id, leader_id) REFERENCES public.profiles(organization_id, id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_teams_org    ON public.teams(organization_id);
CREATE INDEX IF NOT EXISTS idx_teams_leader ON public.teams(leader_id);

CREATE TRIGGER trg_teams_updated_at
  BEFORE UPDATE ON public.teams
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- TEAM MEMBERS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.team_members (
  team_id         UUID        NOT NULL REFERENCES public.teams(id)    ON DELETE CASCADE,
  user_id         UUID        NOT NULL,
  organization_id UUID        NOT NULL,
  joined_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (team_id, user_id),
  FOREIGN KEY (organization_id, user_id) REFERENCES public.profiles(organization_id, id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_team_members_user ON public.team_members(user_id);
CREATE INDEX IF NOT EXISTS idx_team_members_org  ON public.team_members(organization_id);


-- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
-- MIGRATION: 004_customers.sql
-- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

-- ============================================================
-- Migration: 004_customers.sql
-- Description: CRM customer records with contact details
-- ============================================================

CREATE TABLE IF NOT EXISTS public.customers (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID        NOT NULL REFERENCES public.organizations(id) ON DELETE RESTRICT,
  full_name       TEXT        NOT NULL,
  email           TEXT,
  phone           TEXT        NOT NULL,
  phone_alt       TEXT,
  company         TEXT,
  address         TEXT,
  city            TEXT,
  state           TEXT,
  country         TEXT        DEFAULT 'US',
  zip_code        TEXT,
  timezone        TEXT,
  language        TEXT        DEFAULT 'en',
  contact_pref    TEXT        DEFAULT 'any'
                    CHECK (contact_pref IN ('any','morning','afternoon','evening','do_not_call')),
  source          TEXT,
  tags            TEXT[]      DEFAULT '{}',
  notes           TEXT,
  status          TEXT        NOT NULL DEFAULT 'active'
                    CHECK (status IN ('active','inactive','do_not_call')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (organization_id, phone)
);

CREATE INDEX IF NOT EXISTS idx_customers_org    ON public.customers(organization_id);
CREATE INDEX IF NOT EXISTS idx_customers_email  ON public.customers(organization_id, email);
CREATE INDEX IF NOT EXISTS idx_customers_status ON public.customers(organization_id, status);

CREATE TRIGGER trg_customers_updated_at
  BEFORE UPDATE ON public.customers
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- CONTACT NOTES (interaction history per customer)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.contact_notes (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID        NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  author_id   UUID        NOT NULL REFERENCES public.profiles(id)  ON DELETE RESTRICT,
  body        TEXT        NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contact_notes_customer ON public.contact_notes(customer_id);

CREATE TRIGGER trg_contact_notes_updated_at
  BEFORE UPDATE ON public.contact_notes
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
-- MIGRATION: 005_campaigns_and_leads.sql
-- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

-- ============================================================
-- Migration: 005_campaigns_and_leads.sql
-- Description: Campaigns, lead sources, and leads
-- ============================================================

-- ============================================================
-- LEAD SOURCES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.lead_sources (
  id              UUID  PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID  NOT NULL REFERENCES public.organizations(id) ON DELETE RESTRICT,
  name            TEXT  NOT NULL,
  channel         TEXT  DEFAULT 'other'
                    CHECK (channel IN ('web','social','paid_ads','referral','import','manual','other')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (organization_id, name)
);

-- ============================================================
-- CAMPAIGNS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.campaigns (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID        NOT NULL REFERENCES public.organizations(id) ON DELETE RESTRICT,
  name            TEXT        NOT NULL,
  description     TEXT,
  type            TEXT        NOT NULL DEFAULT 'outbound'
                    CHECK (type IN ('outbound','inbound','blended')),
  status          TEXT        NOT NULL DEFAULT 'draft'
                    CHECK (status IN ('draft','active','paused','completed','archived')),
  script          TEXT,
  goal            TEXT,
  start_date      DATE,
  end_date        DATE,
  settings        JSONB       NOT NULL DEFAULT '{}',
  created_by      UUID        REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_campaigns_org    ON public.campaigns(organization_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON public.campaigns(organization_id, status);

CREATE TRIGGER trg_campaigns_updated_at
  BEFORE UPDATE ON public.campaigns
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- CALL DISPOSITIONS (outcome definitions)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.call_dispositions (
  id          UUID  PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT  NOT NULL UNIQUE,
  category    TEXT  NOT NULL DEFAULT 'other'
                CHECK (category IN ('contacted','not_contacted','converted','callback','do_not_call','other')),
  description TEXT,
  is_active   BOOLEAN NOT NULL DEFAULT true
);

INSERT INTO public.call_dispositions (name, category, description) VALUES
  ('Answered - Interested',       'contacted',     'Lead answered and expressed interest'),
  ('Answered - Not Interested',   'contacted',     'Lead answered but declined'),
  ('Answered - Callback',         'callback',      'Lead answered and requested a callback'),
  ('Answered - Converted',        'converted',     'Lead converted to customer'),
  ('No Answer',                   'not_contacted', 'No one picked up'),
  ('Voicemail',                   'not_contacted', 'Left a voicemail'),
  ('Busy',                        'not_contacted', 'Line was busy'),
  ('Wrong Number',                'not_contacted', 'Incorrect phone number'),
  ('Do Not Call',                 'do_not_call',   'Lead requested DNC'),
  ('Disconnected',                'not_contacted', 'Number is disconnected');

-- ============================================================
-- LEADS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.leads (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id   UUID        NOT NULL REFERENCES public.organizations(id)   ON DELETE RESTRICT,
  customer_id       UUID        REFERENCES public.customers(id)                ON DELETE SET NULL,
  campaign_id       UUID        REFERENCES public.campaigns(id)                ON DELETE SET NULL,
  source_id         UUID        REFERENCES public.lead_sources(id)             ON DELETE SET NULL,
  assigned_agent_id UUID,

  -- Contact info (may duplicate customer for import scenarios)
  full_name         TEXT        NOT NULL,
  email             TEXT,
  phone             TEXT        NOT NULL,
  phone_alt         TEXT,
  company           TEXT,

  -- Lead lifecycle
  status            TEXT        NOT NULL DEFAULT 'new'
                      CHECK (status IN ('new','contacted','qualified','converted','lost','archived')),
  priority          TEXT        NOT NULL DEFAULT 'medium'
                      CHECK (priority IN ('low','medium','high','urgent')),
  score             INTEGER     DEFAULT 0 CHECK (score >= 0 AND score <= 100),

  -- Metadata
  source_ref        TEXT,       -- External ID from import
  tags              TEXT[]      DEFAULT '{}',
  custom_fields     JSONB       NOT NULL DEFAULT '{}',
  notes             TEXT,
  last_contacted_at TIMESTAMPTZ,
  next_contact_at   TIMESTAMPTZ,

  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Prevent cross-org agent assignment
  FOREIGN KEY (organization_id, assigned_agent_id)
    REFERENCES public.profiles(organization_id, id)
    ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_leads_org_status   ON public.leads(organization_id, status);
CREATE INDEX IF NOT EXISTS idx_leads_assigned     ON public.leads(assigned_agent_id);
CREATE INDEX IF NOT EXISTS idx_leads_campaign     ON public.leads(campaign_id);
CREATE INDEX IF NOT EXISTS idx_leads_phone        ON public.leads(organization_id, phone);
CREATE INDEX IF NOT EXISTS idx_leads_score        ON public.leads(organization_id, score DESC);
CREATE INDEX IF NOT EXISTS idx_leads_next_contact ON public.leads(organization_id, next_contact_at);

CREATE TRIGGER trg_leads_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
-- MIGRATION: 006_calls_and_recordings.sql
-- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

-- ============================================================
-- Migration: 006_calls_and_recordings.sql
-- Description: Calls, recordings, agent status history
-- ============================================================

-- ============================================================
-- CALLS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.calls (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id  UUID        NOT NULL REFERENCES public.organizations(id)  ON DELETE RESTRICT,
  lead_id          UUID        REFERENCES public.leads(id)                   ON DELETE SET NULL,
  agent_id         UUID        REFERENCES public.profiles(id)                ON DELETE SET NULL,
  campaign_id      UUID        REFERENCES public.campaigns(id)               ON DELETE SET NULL,
  disposition_id   UUID        REFERENCES public.call_dispositions(id)       ON DELETE SET NULL,

  -- Telephony provider reference
  provider_call_id TEXT,
  provider         TEXT        NOT NULL DEFAULT 'unknown',

  direction        TEXT        NOT NULL DEFAULT 'outbound'
                     CHECK (direction IN ('inbound','outbound')),
  status           TEXT        NOT NULL DEFAULT 'initiated'
                     CHECK (status IN ('initiated','ringing','in_progress','completed','failed','no_answer','busy','cancelled')),

  phone_from       TEXT,
  phone_to         TEXT,

  started_at       TIMESTAMPTZ,
  answered_at      TIMESTAMPTZ,
  ended_at         TIMESTAMPTZ,
  duration_seconds INTEGER     DEFAULT 0 CHECK (duration_seconds >= 0),
  talk_time_seconds INTEGER    DEFAULT 0 CHECK (talk_time_seconds >= 0),

  notes            TEXT,
  outcome          TEXT,
  transfer_to      TEXT,

  raw_provider_data JSONB      DEFAULT '{}',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE (provider, provider_call_id),

  FOREIGN KEY (organization_id, agent_id)
    REFERENCES public.profiles(organization_id, id)
    ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_calls_org        ON public.calls(organization_id);
CREATE INDEX IF NOT EXISTS idx_calls_lead       ON public.calls(lead_id);
CREATE INDEX IF NOT EXISTS idx_calls_agent      ON public.calls(agent_id);
CREATE INDEX IF NOT EXISTS idx_calls_campaign   ON public.calls(campaign_id);
CREATE INDEX IF NOT EXISTS idx_calls_started    ON public.calls(organization_id, started_at DESC);
CREATE INDEX IF NOT EXISTS idx_calls_provider   ON public.calls(provider, provider_call_id);

CREATE TRIGGER trg_calls_updated_at
  BEFORE UPDATE ON public.calls
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- CALL RECORDINGS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.call_recordings (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  call_id         UUID        NOT NULL REFERENCES public.calls(id) ON DELETE CASCADE,
  storage_path    TEXT        NOT NULL,
  file_size_bytes BIGINT,
  duration_seconds INTEGER,
  format          TEXT        DEFAULT 'mp3',
  transcription   TEXT,
  retention_until TIMESTAMPTZ,
  is_deleted      BOOLEAN     NOT NULL DEFAULT false,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_call_recordings_call ON public.call_recordings(call_id);

-- ============================================================
-- AGENT STATUS HISTORY
-- ============================================================
CREATE TABLE IF NOT EXISTS public.agent_status_history (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID        NOT NULL REFERENCES public.organizations(id) ON DELETE RESTRICT,
  agent_id        UUID        NOT NULL REFERENCES public.profiles(id)      ON DELETE CASCADE,
  status          TEXT        NOT NULL
                    CHECK (status IN ('available','busy','after_call_work','break','offline')),
  reason          TEXT,
  started_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ended_at        TIMESTAMPTZ,
  duration_seconds INTEGER    GENERATED ALWAYS AS (
                    EXTRACT(EPOCH FROM (ended_at - started_at))::INTEGER
                  ) STORED,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_agent_status_agent ON public.agent_status_history(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_status_org   ON public.agent_status_history(organization_id, started_at DESC);

-- ============================================================
-- WEBHOOK EVENTS (idempotency for telephony providers)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.webhook_events (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  provider     TEXT        NOT NULL,
  event_id     TEXT        NOT NULL,
  event_type   TEXT        NOT NULL,
  status       TEXT        NOT NULL DEFAULT 'received'
                 CHECK (status IN ('received','processing','processed','failed','duplicate')),
  payload      JSONB       NOT NULL DEFAULT '{}',
  error        TEXT,
  processed_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (provider, event_id)
);

CREATE INDEX IF NOT EXISTS idx_webhook_events_status   ON public.webhook_events(status);
CREATE INDEX IF NOT EXISTS idx_webhook_events_created  ON public.webhook_events(created_at DESC);


-- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
-- MIGRATION: 007_follow_ups.sql
-- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

-- ============================================================
-- Migration: 007_follow_ups.sql
-- Description: Follow-up tasks and reminders
-- ============================================================

CREATE TABLE IF NOT EXISTS public.follow_ups (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id   UUID        NOT NULL REFERENCES public.organizations(id)  ON DELETE RESTRICT,
  lead_id           UUID        NOT NULL REFERENCES public.leads(id)          ON DELETE CASCADE,
  assigned_agent_id UUID,
  created_by        UUID        REFERENCES public.profiles(id)                ON DELETE SET NULL,
  call_id           UUID        REFERENCES public.calls(id)                   ON DELETE SET NULL,

  type              TEXT        NOT NULL DEFAULT 'callback'
                      CHECK (type IN ('callback','email','meeting','task','other')),
  status            TEXT        NOT NULL DEFAULT 'pending'
                      CHECK (status IN ('pending','completed','cancelled','overdue')),
  priority          TEXT        NOT NULL DEFAULT 'medium'
                      CHECK (priority IN ('low','medium','high','urgent')),
  notes             TEXT,
  due_at            TIMESTAMPTZ NOT NULL,
  completed_at      TIMESTAMPTZ,
  reminder_sent_at  TIMESTAMPTZ,

  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  FOREIGN KEY (organization_id, assigned_agent_id)
    REFERENCES public.profiles(organization_id, id)
    ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_follow_ups_org     ON public.follow_ups(organization_id);
CREATE INDEX IF NOT EXISTS idx_follow_ups_lead    ON public.follow_ups(lead_id);
CREATE INDEX IF NOT EXISTS idx_follow_ups_agent   ON public.follow_ups(assigned_agent_id);
CREATE INDEX IF NOT EXISTS idx_follow_ups_due     ON public.follow_ups(organization_id, due_at);
CREATE INDEX IF NOT EXISTS idx_follow_ups_status  ON public.follow_ups(organization_id, status);

CREATE TRIGGER trg_follow_ups_updated_at
  BEFORE UPDATE ON public.follow_ups
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Auto-mark overdue: run as a scheduled job or DB function
-- This index supports the overdue query
CREATE INDEX IF NOT EXISTS idx_follow_ups_overdue ON public.follow_ups(due_at)
  WHERE status = 'pending';


-- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
-- MIGRATION: 008_qa_and_audit.sql
-- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

-- ============================================================
-- Migration: 008_qa_and_audit.sql
-- Description: QA reviews, audit logs, notifications
-- ============================================================

-- Ensure required extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Ensure prerequisite parent tables exist
CREATE TABLE IF NOT EXISTS public.organizations (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT        NOT NULL,
  slug        TEXT        NOT NULL UNIQUE,
  status      TEXT        NOT NULL DEFAULT 'active',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.profiles (
  id              UUID        PRIMARY KEY,
  organization_id UUID        NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  full_name       TEXT        NOT NULL,
  status          TEXT        NOT NULL DEFAULT 'active',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.calls (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID        NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- QA REVIEWS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.qa_reviews (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID        NOT NULL REFERENCES public.organizations(id)  ON DELETE RESTRICT,
  call_id         UUID        NOT NULL REFERENCES public.calls(id)          ON DELETE CASCADE,
  reviewer_id     UUID        NOT NULL REFERENCES public.profiles(id)       ON DELETE RESTRICT,
  agent_id        UUID        REFERENCES public.profiles(id)                ON DELETE SET NULL,

  score           SMALLINT    NOT NULL CHECK (score >= 0 AND score <= 100),
  feedback        TEXT,
  strengths       TEXT[],
  improvements    TEXT[],
  scorecard       JSONB       NOT NULL DEFAULT '{}',  -- rubric category scores
  status          TEXT        NOT NULL DEFAULT 'draft'
                    CHECK (status IN ('draft','submitted','acknowledged')),
  acknowledged_at TIMESTAMPTZ,

  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (call_id, reviewer_id)
);

CREATE INDEX IF NOT EXISTS idx_qa_reviews_call     ON public.qa_reviews(call_id);
CREATE INDEX IF NOT EXISTS idx_qa_reviews_agent    ON public.qa_reviews(agent_id);
CREATE INDEX IF NOT EXISTS idx_qa_reviews_org      ON public.qa_reviews(organization_id);

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_qa_reviews_updated_at ON public.qa_reviews;
CREATE TRIGGER trg_qa_reviews_updated_at
  BEFORE UPDATE ON public.qa_reviews
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- AUDIT LOGS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID        REFERENCES public.organizations(id) ON DELETE SET NULL,
  actor_id        UUID        REFERENCES public.profiles(id)      ON DELETE SET NULL,
  action          TEXT        NOT NULL,   -- e.g. 'leads.assigned', 'users.role_changed'
  resource_type   TEXT        NOT NULL,   -- e.g. 'lead', 'user', 'campaign'
  resource_id     UUID,
  old_value       JSONB,
  new_value       JSONB,
  ip_address      INET,
  user_agent      TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Partitioning hint: consider range partitioning by created_at for large volumes
CREATE INDEX IF NOT EXISTS idx_audit_logs_org      ON public.audit_logs(organization_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor    ON public.audit_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action   ON public.audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created  ON public.audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource ON public.audit_logs(resource_type, resource_id);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID        REFERENCES public.organizations(id) ON DELETE CASCADE,
  recipient_id    UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type            TEXT        NOT NULL DEFAULT 'in_app'
                    CHECK (type IN ('in_app','email','sms')),
  category        TEXT        NOT NULL DEFAULT 'general'
                    CHECK (category IN ('follow_up','lead_assigned','call_completed','system','general')),
  title           TEXT        NOT NULL,
  body            TEXT,
  link            TEXT,
  status          TEXT        NOT NULL DEFAULT 'unread'
                    CHECK (status IN ('unread','read','dismissed')),
  read_at         TIMESTAMPTZ,
  sent_at         TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON public.notifications(recipient_id, status);
CREATE INDEX IF NOT EXISTS idx_notifications_created   ON public.notifications(created_at DESC);


-- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
-- MIGRATION: 009_rls_policies.sql
-- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

-- ============================================================
-- Migration: 009_rls_policies.sql
-- Description: Row Level Security policies for all tables
-- ============================================================

-- Enable RLS on every table
ALTER TABLE public.organizations        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles                ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams                ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_notes        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_sources         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.call_dispositions    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads                ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calls                ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.call_recordings      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_events       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follow_ups           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qa_reviews           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications        ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- Helper function: get the current user's organization_id
-- ============================================================
CREATE OR REPLACE FUNCTION public.current_org_id()
RETURNS UUID
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT organization_id FROM public.profiles WHERE id = auth.uid();
$$;

-- ============================================================
-- Helper function: check if current user has a permission
-- ============================================================
CREATE OR REPLACE FUNCTION public.has_permission(perm TEXT)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    JOIN public.role_permissions rp ON rp.role_id = ur.role_id
    JOIN public.permissions p ON p.id = rp.permission_id
    WHERE ur.user_id = auth.uid()
      AND ur.organization_id = public.current_org_id()
      AND p.permission_key = perm
  );
$$;

-- ============================================================
-- Helper function: check if super_admin
-- ============================================================
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    JOIN public.roles r ON r.id = ur.role_id
    WHERE ur.user_id = auth.uid()
      AND r.name = 'super_admin'
  );
$$;

-- ============================================================
-- ORGANIZATIONS
-- ============================================================
-- Super admins see all; members see their own org
CREATE POLICY "orgs_select" ON public.organizations FOR SELECT
  USING (public.is_super_admin() OR id = public.current_org_id());

CREATE POLICY "orgs_insert" ON public.organizations FOR INSERT
  WITH CHECK (public.is_super_admin());

CREATE POLICY "orgs_update" ON public.organizations FOR UPDATE
  USING (public.is_super_admin() OR (id = public.current_org_id() AND public.has_permission('organizations.manage')))
  WITH CHECK (public.is_super_admin() OR (id = public.current_org_id() AND public.has_permission('organizations.manage')));

-- ============================================================
-- PROFILES
-- ============================================================
CREATE POLICY "profiles_select" ON public.profiles FOR SELECT
  USING (public.is_super_admin() OR organization_id = public.current_org_id());

CREATE POLICY "profiles_insert" ON public.profiles FOR INSERT
  WITH CHECK (organization_id = public.current_org_id() AND public.has_permission('users.create'));

CREATE POLICY "profiles_update" ON public.profiles FOR UPDATE
  USING (id = auth.uid() OR (organization_id = public.current_org_id() AND public.has_permission('users.update')));

-- ============================================================
-- USER_ROLES
-- ============================================================
CREATE POLICY "user_roles_select" ON public.user_roles FOR SELECT
  USING (organization_id = public.current_org_id() OR public.is_super_admin());

CREATE POLICY "user_roles_manage" ON public.user_roles FOR ALL
  USING (organization_id = public.current_org_id() AND public.has_permission('users.update'));

-- ============================================================
-- ROLES / PERMISSIONS / ROLE_PERMISSIONS  (read-only for all authenticated)
-- ============================================================
CREATE POLICY "roles_select"       ON public.roles       FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "permissions_select" ON public.permissions FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "role_perm_select"   ON public.role_permissions FOR SELECT USING (auth.uid() IS NOT NULL);

-- ============================================================
-- TEAMS
-- ============================================================
CREATE POLICY "teams_select" ON public.teams FOR SELECT
  USING (organization_id = public.current_org_id());

CREATE POLICY "teams_manage" ON public.teams FOR ALL
  USING (organization_id = public.current_org_id() AND public.has_permission('teams.manage'));

-- ============================================================
-- TEAM_MEMBERS
-- ============================================================
CREATE POLICY "team_members_select" ON public.team_members FOR SELECT
  USING (organization_id = public.current_org_id());

CREATE POLICY "team_members_manage" ON public.team_members FOR ALL
  USING (organization_id = public.current_org_id() AND public.has_permission('teams.manage'));

-- ============================================================
-- CUSTOMERS / CONTACT_NOTES
-- ============================================================
CREATE POLICY "customers_select" ON public.customers FOR SELECT
  USING (organization_id = public.current_org_id() AND public.has_permission('leads.read'));

CREATE POLICY "customers_insert" ON public.customers FOR INSERT
  WITH CHECK (organization_id = public.current_org_id() AND public.has_permission('leads.create'));

CREATE POLICY "customers_update" ON public.customers FOR UPDATE
  USING (organization_id = public.current_org_id() AND public.has_permission('leads.update'));

CREATE POLICY "contact_notes_select" ON public.contact_notes FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.customers c WHERE c.id = customer_id AND c.organization_id = public.current_org_id()));

CREATE POLICY "contact_notes_insert" ON public.contact_notes FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.customers c WHERE c.id = customer_id AND c.organization_id = public.current_org_id()));

-- ============================================================
-- CAMPAIGNS / LEAD_SOURCES
-- ============================================================
CREATE POLICY "campaigns_select" ON public.campaigns FOR SELECT
  USING (organization_id = public.current_org_id());

CREATE POLICY "campaigns_manage" ON public.campaigns FOR ALL
  USING (organization_id = public.current_org_id() AND public.has_permission('campaigns.manage'));

CREATE POLICY "lead_sources_select" ON public.lead_sources FOR SELECT
  USING (organization_id = public.current_org_id());

-- ============================================================
-- CALL_DISPOSITIONS (global lookup — all authenticated users)
-- ============================================================
CREATE POLICY "call_disp_select" ON public.call_dispositions FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- ============================================================
-- LEADS
-- ============================================================
CREATE POLICY "leads_select" ON public.leads FOR SELECT
  USING (organization_id = public.current_org_id() AND public.has_permission('leads.read'));

CREATE POLICY "leads_insert" ON public.leads FOR INSERT
  WITH CHECK (organization_id = public.current_org_id() AND public.has_permission('leads.create'));

CREATE POLICY "leads_update" ON public.leads FOR UPDATE
  USING (organization_id = public.current_org_id() AND public.has_permission('leads.update'));

-- ============================================================
-- CALLS
-- ============================================================
CREATE POLICY "calls_select" ON public.calls FOR SELECT
  USING (organization_id = public.current_org_id() AND public.has_permission('calls.read'));

CREATE POLICY "calls_insert" ON public.calls FOR INSERT
  WITH CHECK (organization_id = public.current_org_id() AND public.has_permission('calls.initiate'));

CREATE POLICY "calls_update" ON public.calls FOR UPDATE
  USING (organization_id = public.current_org_id() AND public.has_permission('calls.update'));

-- ============================================================
-- CALL_RECORDINGS
-- ============================================================
CREATE POLICY "recordings_select" ON public.call_recordings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.calls c
      WHERE c.id = call_id
        AND c.organization_id = public.current_org_id()
    )
    AND public.has_permission('calls.recording.read')
  );

-- ============================================================
-- FOLLOW_UPS
-- ============================================================
CREATE POLICY "follow_ups_select" ON public.follow_ups FOR SELECT
  USING (organization_id = public.current_org_id() AND public.has_permission('leads.read'));

CREATE POLICY "follow_ups_manage" ON public.follow_ups FOR ALL
  USING (organization_id = public.current_org_id() AND public.has_permission('follow_ups.manage'));

-- ============================================================
-- QA_REVIEWS
-- ============================================================
CREATE POLICY "qa_reviews_select" ON public.qa_reviews FOR SELECT
  USING (organization_id = public.current_org_id() AND public.has_permission('qa_reviews.read'));

CREATE POLICY "qa_reviews_insert" ON public.qa_reviews FOR INSERT
  WITH CHECK (organization_id = public.current_org_id() AND public.has_permission('qa_reviews.create'));

-- ============================================================
-- AUDIT_LOGS (read-only)
-- ============================================================
CREATE POLICY "audit_logs_select" ON public.audit_logs FOR SELECT
  USING (organization_id = public.current_org_id() AND public.has_permission('audit_logs.read'));

-- Only service role should insert
CREATE POLICY "audit_logs_insert" ON public.audit_logs FOR INSERT
  WITH CHECK (false);  -- Block anon/user inserts; backend uses service role

-- ============================================================
-- NOTIFICATIONS
-- ============================================================
CREATE POLICY "notifications_select" ON public.notifications FOR SELECT
  USING (recipient_id = auth.uid());

CREATE POLICY "notifications_update" ON public.notifications FOR UPDATE
  USING (recipient_id = auth.uid());

-- ============================================================
-- AGENT_STATUS_HISTORY
-- ============================================================
CREATE POLICY "agent_status_select" ON public.agent_status_history FOR SELECT
  USING (organization_id = public.current_org_id());

CREATE POLICY "agent_status_insert" ON public.agent_status_history FOR INSERT
  WITH CHECK (organization_id = public.current_org_id() AND agent_id = auth.uid());

-- ============================================================
-- WEBHOOK_EVENTS (service role only)
-- ============================================================
CREATE POLICY "webhook_events_deny_all" ON public.webhook_events FOR ALL
  USING (false);


-- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
-- MIGRATION: 010_multi_level_rbac_seed.sql
-- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

-- ============================================================================
-- Migration: 010_multi_level_rbac_seed.sql
-- Description: Multi-Level Role-Based Access Control (RBAC) Architecture
-- Section 3: Human Roles and System Permissions
-- ============================================================================

-- Ensure uuid-ossp extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Ensure prerequisite tables exist
CREATE TABLE IF NOT EXISTS public.organizations (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT        NOT NULL,
  slug        TEXT        NOT NULL UNIQUE,
  status      TEXT        NOT NULL DEFAULT 'active',
  plan        TEXT        NOT NULL DEFAULT 'trial',
  settings    JSONB       NOT NULL DEFAULT '{}',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.profiles (
  id              UUID        PRIMARY KEY,
  organization_id UUID        NOT NULL,
  full_name       TEXT        NOT NULL,
  phone           TEXT,
  avatar_url      TEXT,
  status          TEXT        NOT NULL DEFAULT 'active',
  timezone        TEXT        NOT NULL DEFAULT 'UTC',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.roles (
  id          UUID  PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT  NOT NULL UNIQUE,
  description TEXT
);

CREATE TABLE IF NOT EXISTS public.permissions (
  id             UUID  PRIMARY KEY DEFAULT gen_random_uuid(),
  permission_key TEXT  NOT NULL UNIQUE,
  description    TEXT
);

CREATE TABLE IF NOT EXISTS public.role_permissions (
  role_id       UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  permission_id UUID NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

-- Ensure 10 System Roles exist
INSERT INTO public.roles (name, description) VALUES
  ('super_admin',         'Platform-wide administration, global configuration and subscriptions'),
  ('business_admin',      'Organization administrator managing business settings, users, teams and campaigns'),
  ('manager',             'Call Center Manager managing operations, lead distribution, targets and team performance'),
  ('supervisor',          'Supervisor / Team Leader monitoring assigned agents, coaching and reassigning leads'),
  ('agent',               'Call Center Agent handling assigned leads, making calls and logging dispositions'),
  ('crm_manager',         'CRM / Lead Manager importing, validating, deduplicating and distributing leads'),
  ('qa_officer',          'QA Officer reviewing authorized call recordings, scoring quality and recording feedback'),
  ('reporting_analyst',   'Reporting Analyst viewing permitted performance reports and exporting data'),
  ('auditor',             'Auditor reading audit logs and investigating changes without modifying operational records'),
  ('integration_admin',   'Integration Administrator configuring telephony integrations, webhooks and credentials'),
  ('background_worker',   'Restricted background worker processing reminders, imports and scheduled tasks')
ON CONFLICT (name) DO UPDATE SET description = EXCLUDED.description;

-- Ensure Granular Permission Keys exist
INSERT INTO public.permissions (permission_key, description) VALUES
  ('organizations.create',       'Create new business organizations'),
  ('organizations.read',         'View organization settings and details'),
  ('organizations.update',       'Update organization preferences'),
  ('organizations.manage',       'Full administrative control over organizations'),
  ('users.create',               'Create and provision accounts with passwords'),
  ('users.read',                 'View user roster and profiles'),
  ('users.update',               'Edit user roles, teams, and profiles'),
  ('users.deactivate',           'Suspend or deactivate user credentials'),
  ('roles.read',                 'View role catalog and permission sets'),
  ('roles.manage',               'Configure organization roles and assign permissions'),
  ('leads.create',               'Create lead records'),
  ('leads.read',                 'View lead records in permitted scope'),
  ('leads.update',               'Edit lead details and disposition'),
  ('leads.assign',               'Assign leads to agents or teams'),
  ('leads.import',               'Bulk import leads via CSV/Excel'),
  ('leads.export',               'Export lead datasets'),
  ('leads.archive',              'Archive or delete leads'),
  ('calls.initiate',             'Initiate outbound calls via dialer'),
  ('calls.read',                 'View call records and history'),
  ('calls.update',               'Update call disposition and notes'),
  ('calls.recording.read',       'Listen to and download call recordings'),
  ('dialer.operate',             'Operate assigned agent softphone dialer'),
  ('dialer.configure',           'Configure predictive dialer queues and trunks'),
  ('dialer.monitor',             'Live whisper, barge-in and agent monitor'),
  ('qa_reviews.create',          'Evaluate and score recorded calls'),
  ('qa_reviews.read',            'View QA scorecards and agent feedback'),
  ('qa_reviews.update',          'Modify scorecards and dispute evaluations'),
  ('reports.view',               'Access analytical performance reports'),
  ('reports.export',             'Export report datasets'),
  ('audit_logs.read',            'Inspect security and compliance audit logs'),
  ('integrations.read',          'View active webhooks and telephony trunks'),
  ('integrations.manage',        'Configure telephony credentials, webhooks, and APIs')
ON CONFLICT (permission_key) DO UPDATE SET description = EXCLUDED.description;

-- Invitations table for secure account provisioning
CREATE TABLE IF NOT EXISTS public.organization_invitations (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID        NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  email           TEXT        NOT NULL,
  role_id         UUID        NOT NULL REFERENCES public.roles(id) ON DELETE RESTRICT,
  token_hash      TEXT        NOT NULL UNIQUE,
  invited_by      UUID        NOT NULL REFERENCES public.profiles(id),
  expires_at      TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '7 days'),
  accepted_at     TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_org_invitations_email ON public.organization_invitations(email);
CREATE INDEX IF NOT EXISTS idx_org_invitations_org   ON public.organization_invitations(organization_id);

-- Enable Row Level Security
ALTER TABLE public.organization_invitations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Org admins can manage invitations"
  ON public.organization_invitations
  FOR ALL
  USING (
    organization_id IN (
      SELECT organization_id FROM public.profiles WHERE id = auth.uid()
    )
  );


-- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
-- MIGRATION: 011_organization_invitations.sql
-- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

-- ============================================================
-- Migration: 011_organization_invitations.sql
-- Description: Organization invitation system for RBAC user provisioning
-- Implements Section 6: Account Provisioning Workflow
-- ============================================================

-- ── ORGANIZATION INVITATIONS TABLE ───────────────────────────────────────────
-- Tracks pending email invitations from Business Admins to users.
-- Users set their own password via the invitation link (never plain-text).
CREATE TABLE IF NOT EXISTS public.organization_invitations (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  email            TEXT        NOT NULL,
  organization_id  UUID        NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  role_id          UUID        NOT NULL REFERENCES public.roles(id)         ON DELETE CASCADE,
  token_hash       TEXT        NOT NULL UNIQUE,  -- UUID token stored server-side, sent in email link
  invited_by       UUID        REFERENCES public.profiles(id) ON DELETE SET NULL,
  expires_at       TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '7 days'),
  accepted_at      TIMESTAMPTZ,                  -- NULL = pending, non-NULL = accepted
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_invitations_email  ON public.organization_invitations(email);
CREATE INDEX IF NOT EXISTS idx_invitations_org    ON public.organization_invitations(organization_id);
CREATE INDEX IF NOT EXISTS idx_invitations_token  ON public.organization_invitations(token_hash);

-- ── PLATFORM-LEVEL SUPER ADMIN TABLE ─────────────────────────────────────────
-- Super admins are NOT stored as normal organization users.
-- They use a separate platform-level authorization model.
CREATE TABLE IF NOT EXISTS public.platform_admins (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE RESTRICT,
  full_name   TEXT NOT NULL,
  email       TEXT NOT NULL UNIQUE,
  status      TEXT NOT NULL DEFAULT 'active'
                CHECK (status IN ('active', 'inactive')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── RLS: Invitations ──────────────────────────────────────────────────────────
ALTER TABLE public.organization_invitations ENABLE ROW LEVEL SECURITY;

-- Only organization admins can read/create invitations for their org
CREATE POLICY "org_admins_manage_invitations"
  ON public.organization_invitations
  FOR ALL
  USING (
    organization_id IN (
      SELECT p.organization_id
      FROM public.profiles p
      JOIN public.user_roles ur ON ur.user_id = p.id AND ur.organization_id = p.organization_id
      JOIN public.roles r ON r.id = ur.role_id
      WHERE p.id = auth.uid()
        AND r.name IN ('super_admin', 'business_admin')
    )
  );

-- ── RLS: Platform Admins ──────────────────────────────────────────────────────
ALTER TABLE public.platform_admins ENABLE ROW LEVEL SECURITY;

-- Only the platform admin themselves can read their own record
CREATE POLICY "platform_admin_self_read"
  ON public.platform_admins
  FOR SELECT
  USING (id = auth.uid());

-- ── HELPER FUNCTION: Check if user is Super Admin ────────────────────────────
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    JOIN public.roles r ON r.id = ur.role_id
    WHERE ur.user_id = auth.uid()
      AND r.name = 'super_admin'
  );
$$;

-- ── HELPER FUNCTION: Get user's organization_id ───────────────────────────────
CREATE OR REPLACE FUNCTION public.auth_org_id()
RETURNS UUID
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT organization_id
  FROM public.profiles
  WHERE id = auth.uid()
  LIMIT 1;
$$;

-- ── UPDATE ROLES TABLE: Add is_system_role field ─────────────────────────────
ALTER TABLE public.roles
  ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS is_system_role   BOOLEAN NOT NULL DEFAULT true;

-- System roles have NULL organization_id (platform-wide)
-- Custom org-level roles will have a non-NULL organization_id

-- Mark all existing roles as system roles
UPDATE public.roles SET is_system_role = true WHERE organization_id IS NULL;

-- ── AUDIT LOG INDEX ───────────────────────────────────────────────────────────
-- Ensure audit_logs has proper indexes for performance
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor     ON public.audit_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource  ON public.audit_logs(resource_type, resource_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action    ON public.audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created   ON public.audit_logs(created_at DESC);

-- ── ORGANIZATIONS TABLE ADDITIONS ────────────────────────────────────────────
ALTER TABLE public.organizations
  ADD COLUMN IF NOT EXISTS subscription_tier TEXT NOT NULL DEFAULT 'standard'
    CHECK (subscription_tier IN ('standard', 'pro', 'enterprise')),
  ADD COLUMN IF NOT EXISTS max_seats         INTEGER NOT NULL DEFAULT 25;

-- ── COMMENTS for documentation ───────────────────────────────────────────────
COMMENT ON TABLE public.organization_invitations IS
  'Invitation tokens for new users. Business Admins send invites; users set their own password via the link. Never stores plain-text passwords.';

COMMENT ON TABLE public.platform_admins IS
  'Super Admin accounts. Stored separately from org users to enforce platform-level isolation.';

COMMENT ON FUNCTION public.is_super_admin IS
  'Returns true if the authenticated user holds the super_admin role.';

COMMENT ON FUNCTION public.auth_org_id IS
  'Returns the organization_id of the currently authenticated user.';


-- ============================================================================
-- DEFAULT SEED ORGANIZATION & BASELINE DATA
-- ============================================================================
INSERT INTO public.organizations (id, name, slug, status, plan)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'Example Call Center', 'example-call-center', 'active', 'enterprise')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.organizations (id, name, slug, status, plan)
VALUES 
  ('00000000-0000-0000-0000-000000000002', 'Apex Telephony Corp', 'apex-telephony', 'active', 'professional')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.organizations (id, name, slug, status, plan)
VALUES 
  ('00000000-0000-0000-0000-000000000003', 'Lander Global Enterprises', 'lander-global', 'active', 'enterprise')
ON CONFLICT (id) DO NOTHING;

-- Link all permissions to super_admin and business_admin roles
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r
CROSS JOIN public.permissions p
WHERE r.name IN ('super_admin', 'business_admin')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- SETUP COMPLETED SUCCESSFULLY!
-- ============================================================================
