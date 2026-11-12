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
DROP POLICY IF EXISTS "org_admins_manage_invitations" ON public.organization_invitations;
CREATE POLICY "org_admins_manage_invitations" ON public.organization_invitations
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
DROP POLICY IF EXISTS "platform_admin_self_read" ON public.platform_admins;
CREATE POLICY "platform_admin_self_read" ON public.platform_admins
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

