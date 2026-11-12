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
DROP POLICY IF EXISTS "orgs_select" ON public.organizations;
CREATE POLICY "orgs_select" ON public.organizations FOR SELECT
  USING (public.is_super_admin() OR id = public.current_org_id());

DROP POLICY IF EXISTS "orgs_insert" ON public.organizations;
CREATE POLICY "orgs_insert" ON public.organizations FOR INSERT
  WITH CHECK (public.is_super_admin());

DROP POLICY IF EXISTS "orgs_update" ON public.organizations;
CREATE POLICY "orgs_update" ON public.organizations FOR UPDATE
  USING (public.is_super_admin() OR (id = public.current_org_id() AND public.has_permission('organizations.manage')))
  WITH CHECK (public.is_super_admin() OR (id = public.current_org_id() AND public.has_permission('organizations.manage')));

-- ============================================================
-- PROFILES
-- ============================================================
DROP POLICY IF EXISTS "profiles_select" ON public.profiles;
CREATE POLICY "profiles_select" ON public.profiles FOR SELECT
  USING (public.is_super_admin() OR organization_id = public.current_org_id());

DROP POLICY IF EXISTS "profiles_insert" ON public.profiles;
CREATE POLICY "profiles_insert" ON public.profiles FOR INSERT
  WITH CHECK (organization_id = public.current_org_id() AND public.has_permission('users.create'));

DROP POLICY IF EXISTS "profiles_update" ON public.profiles;
CREATE POLICY "profiles_update" ON public.profiles FOR UPDATE
  USING (id = auth.uid() OR (organization_id = public.current_org_id() AND public.has_permission('users.update')));

-- ============================================================
-- USER_ROLES
-- ============================================================
DROP POLICY IF EXISTS "user_roles_select" ON public.user_roles;
CREATE POLICY "user_roles_select" ON public.user_roles FOR SELECT
  USING (organization_id = public.current_org_id() OR public.is_super_admin());

DROP POLICY IF EXISTS "user_roles_manage" ON public.user_roles;
CREATE POLICY "user_roles_manage" ON public.user_roles FOR ALL
  USING (organization_id = public.current_org_id() AND public.has_permission('users.update'));

-- ============================================================
-- ROLES / PERMISSIONS / ROLE_PERMISSIONS  (read-only for all authenticated)
-- ============================================================
DROP POLICY IF EXISTS "roles_select" ON public.roles;
CREATE POLICY "roles_select" ON public.roles       FOR SELECT USING (auth.uid() IS NOT NULL);
DROP POLICY IF EXISTS "permissions_select" ON public.permissions;
CREATE POLICY "permissions_select" ON public.permissions FOR SELECT USING (auth.uid() IS NOT NULL);
DROP POLICY IF EXISTS "role_perm_select" ON public.role_permissions;
CREATE POLICY "role_perm_select" ON public.role_permissions FOR SELECT USING (auth.uid() IS NOT NULL);

-- ============================================================
-- TEAMS
-- ============================================================
DROP POLICY IF EXISTS "teams_select" ON public.teams;
CREATE POLICY "teams_select" ON public.teams FOR SELECT
  USING (organization_id = public.current_org_id());

DROP POLICY IF EXISTS "teams_manage" ON public.teams;
CREATE POLICY "teams_manage" ON public.teams FOR ALL
  USING (organization_id = public.current_org_id() AND public.has_permission('teams.manage'));

-- ============================================================
-- TEAM_MEMBERS
-- ============================================================
DROP POLICY IF EXISTS "team_members_select" ON public.team_members;
CREATE POLICY "team_members_select" ON public.team_members FOR SELECT
  USING (organization_id = public.current_org_id());

DROP POLICY IF EXISTS "team_members_manage" ON public.team_members;
CREATE POLICY "team_members_manage" ON public.team_members FOR ALL
  USING (organization_id = public.current_org_id() AND public.has_permission('teams.manage'));

-- ============================================================
-- CUSTOMERS / CONTACT_NOTES
-- ============================================================
DROP POLICY IF EXISTS "customers_select" ON public.customers;
CREATE POLICY "customers_select" ON public.customers FOR SELECT
  USING (organization_id = public.current_org_id() AND public.has_permission('leads.read'));

DROP POLICY IF EXISTS "customers_insert" ON public.customers;
CREATE POLICY "customers_insert" ON public.customers FOR INSERT
  WITH CHECK (organization_id = public.current_org_id() AND public.has_permission('leads.create'));

DROP POLICY IF EXISTS "customers_update" ON public.customers;
CREATE POLICY "customers_update" ON public.customers FOR UPDATE
  USING (organization_id = public.current_org_id() AND public.has_permission('leads.update'));

DROP POLICY IF EXISTS "contact_notes_select" ON public.contact_notes;
CREATE POLICY "contact_notes_select" ON public.contact_notes FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.customers c WHERE c.id = customer_id AND c.organization_id = public.current_org_id()));

DROP POLICY IF EXISTS "contact_notes_insert" ON public.contact_notes;
CREATE POLICY "contact_notes_insert" ON public.contact_notes FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.customers c WHERE c.id = customer_id AND c.organization_id = public.current_org_id()));

-- ============================================================
-- CAMPAIGNS / LEAD_SOURCES
-- ============================================================
DROP POLICY IF EXISTS "campaigns_select" ON public.campaigns;
CREATE POLICY "campaigns_select" ON public.campaigns FOR SELECT
  USING (organization_id = public.current_org_id());

DROP POLICY IF EXISTS "campaigns_manage" ON public.campaigns;
CREATE POLICY "campaigns_manage" ON public.campaigns FOR ALL
  USING (organization_id = public.current_org_id() AND public.has_permission('campaigns.manage'));

DROP POLICY IF EXISTS "lead_sources_select" ON public.lead_sources;
CREATE POLICY "lead_sources_select" ON public.lead_sources FOR SELECT
  USING (organization_id = public.current_org_id());

-- ============================================================
-- CALL_DISPOSITIONS (global lookup — all authenticated users)
-- ============================================================
DROP POLICY IF EXISTS "call_disp_select" ON public.call_dispositions;
CREATE POLICY "call_disp_select" ON public.call_dispositions FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- ============================================================
-- LEADS
-- ============================================================
DROP POLICY IF EXISTS "leads_select" ON public.leads;
CREATE POLICY "leads_select" ON public.leads FOR SELECT
  USING (organization_id = public.current_org_id() AND public.has_permission('leads.read'));

DROP POLICY IF EXISTS "leads_insert" ON public.leads;
CREATE POLICY "leads_insert" ON public.leads FOR INSERT
  WITH CHECK (organization_id = public.current_org_id() AND public.has_permission('leads.create'));

DROP POLICY IF EXISTS "leads_update" ON public.leads;
CREATE POLICY "leads_update" ON public.leads FOR UPDATE
  USING (organization_id = public.current_org_id() AND public.has_permission('leads.update'));

-- ============================================================
-- CALLS
-- ============================================================
DROP POLICY IF EXISTS "calls_select" ON public.calls;
CREATE POLICY "calls_select" ON public.calls FOR SELECT
  USING (organization_id = public.current_org_id() AND public.has_permission('calls.read'));

DROP POLICY IF EXISTS "calls_insert" ON public.calls;
CREATE POLICY "calls_insert" ON public.calls FOR INSERT
  WITH CHECK (organization_id = public.current_org_id() AND public.has_permission('calls.initiate'));

DROP POLICY IF EXISTS "calls_update" ON public.calls;
CREATE POLICY "calls_update" ON public.calls FOR UPDATE
  USING (organization_id = public.current_org_id() AND public.has_permission('calls.update'));

-- ============================================================
-- CALL_RECORDINGS
-- ============================================================
DROP POLICY IF EXISTS "recordings_select" ON public.call_recordings;
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
DROP POLICY IF EXISTS "follow_ups_select" ON public.follow_ups;
CREATE POLICY "follow_ups_select" ON public.follow_ups FOR SELECT
  USING (organization_id = public.current_org_id() AND public.has_permission('leads.read'));

DROP POLICY IF EXISTS "follow_ups_manage" ON public.follow_ups;
CREATE POLICY "follow_ups_manage" ON public.follow_ups FOR ALL
  USING (organization_id = public.current_org_id() AND public.has_permission('follow_ups.manage'));

-- ============================================================
-- QA_REVIEWS
-- ============================================================
DROP POLICY IF EXISTS "qa_reviews_select" ON public.qa_reviews;
CREATE POLICY "qa_reviews_select" ON public.qa_reviews FOR SELECT
  USING (organization_id = public.current_org_id() AND public.has_permission('qa_reviews.read'));

DROP POLICY IF EXISTS "qa_reviews_insert" ON public.qa_reviews;
CREATE POLICY "qa_reviews_insert" ON public.qa_reviews FOR INSERT
  WITH CHECK (organization_id = public.current_org_id() AND public.has_permission('qa_reviews.create'));

-- ============================================================
-- AUDIT_LOGS (read-only)
-- ============================================================
DROP POLICY IF EXISTS "audit_logs_select" ON public.audit_logs;
CREATE POLICY "audit_logs_select" ON public.audit_logs FOR SELECT
  USING (organization_id = public.current_org_id() AND public.has_permission('audit_logs.read'));

-- Only service role should insert
DROP POLICY IF EXISTS "audit_logs_insert" ON public.audit_logs;
CREATE POLICY "audit_logs_insert" ON public.audit_logs FOR INSERT
  WITH CHECK (false);  -- Block anon/user inserts; backend uses service role

-- ============================================================
-- NOTIFICATIONS
-- ============================================================
DROP POLICY IF EXISTS "notifications_select" ON public.notifications;
CREATE POLICY "notifications_select" ON public.notifications FOR SELECT
  USING (recipient_id = auth.uid());

DROP POLICY IF EXISTS "notifications_update" ON public.notifications;
CREATE POLICY "notifications_update" ON public.notifications FOR UPDATE
  USING (recipient_id = auth.uid());

-- ============================================================
-- AGENT_STATUS_HISTORY
-- ============================================================
DROP POLICY IF EXISTS "agent_status_select" ON public.agent_status_history;
CREATE POLICY "agent_status_select" ON public.agent_status_history FOR SELECT
  USING (organization_id = public.current_org_id());

DROP POLICY IF EXISTS "agent_status_insert" ON public.agent_status_history;
CREATE POLICY "agent_status_insert" ON public.agent_status_history FOR INSERT
  WITH CHECK (organization_id = public.current_org_id() AND agent_id = auth.uid());

-- ============================================================
-- WEBHOOK_EVENTS (service role only)
-- ============================================================
DROP POLICY IF EXISTS "webhook_events_deny_all" ON public.webhook_events;
CREATE POLICY "webhook_events_deny_all" ON public.webhook_events FOR ALL
  USING (false);
