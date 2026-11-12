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

DROP POLICY IF EXISTS "Org admins can manage invitations" ON public.organization_invitations;
CREATE POLICY "Org admins can manage invitations" ON public.organization_invitations
  FOR ALL
  USING (
    organization_id IN (
      SELECT organization_id FROM public.profiles WHERE id = auth.uid()
    )
  );

