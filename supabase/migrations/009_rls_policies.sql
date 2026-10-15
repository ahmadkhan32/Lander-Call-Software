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
