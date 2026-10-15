-- ============================================================
-- Migration: 002_profiles_roles_permissions.sql
-- Description: User profiles, roles, permissions, RBAC mapping tables
-- ============================================================

-- ============================================================
-- PROFILES  (extends auth.users)
-- ============================================================
CREATE TABLE public.profiles (
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

CREATE INDEX idx_profiles_org     ON public.profiles(organization_id);
CREATE INDEX idx_profiles_status  ON public.profiles(status);

CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- ROLES
-- ============================================================
CREATE TABLE public.roles (
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
CREATE TABLE public.permissions (
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
CREATE TABLE public.user_roles (
  user_id         UUID NOT NULL,
  role_id         UUID NOT NULL REFERENCES public.roles(id)  ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  granted_by      UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  granted_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, role_id, organization_id),
  FOREIGN KEY (organization_id, user_id) REFERENCES public.profiles(organization_id, id) ON DELETE CASCADE
);

CREATE INDEX idx_user_roles_user ON public.user_roles(user_id);
CREATE INDEX idx_user_roles_org  ON public.user_roles(organization_id);

-- ============================================================
-- ROLE ↔ PERMISSION
-- ============================================================
CREATE TABLE public.role_permissions (
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
