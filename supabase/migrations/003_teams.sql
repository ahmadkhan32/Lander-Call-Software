-- ============================================================
-- Migration: 003_teams.sql
-- Description: Teams and team membership
-- ============================================================

CREATE TABLE public.teams (
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

CREATE INDEX idx_teams_org    ON public.teams(organization_id);
CREATE INDEX idx_teams_leader ON public.teams(leader_id);

CREATE TRIGGER trg_teams_updated_at
  BEFORE UPDATE ON public.teams
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- TEAM MEMBERS
-- ============================================================
CREATE TABLE public.team_members (
  team_id         UUID        NOT NULL REFERENCES public.teams(id)    ON DELETE CASCADE,
  user_id         UUID        NOT NULL,
  organization_id UUID        NOT NULL,
  joined_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (team_id, user_id),
  FOREIGN KEY (organization_id, user_id) REFERENCES public.profiles(organization_id, id) ON DELETE CASCADE
);

CREATE INDEX idx_team_members_user ON public.team_members(user_id);
CREATE INDEX idx_team_members_org  ON public.team_members(organization_id);
