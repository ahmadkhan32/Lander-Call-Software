-- ============================================================
-- Migration: 007_follow_ups.sql
-- Description: Follow-up tasks and reminders
-- ============================================================

CREATE TABLE public.follow_ups (
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

CREATE INDEX idx_follow_ups_org     ON public.follow_ups(organization_id);
CREATE INDEX idx_follow_ups_lead    ON public.follow_ups(lead_id);
CREATE INDEX idx_follow_ups_agent   ON public.follow_ups(assigned_agent_id);
CREATE INDEX idx_follow_ups_due     ON public.follow_ups(organization_id, due_at);
CREATE INDEX idx_follow_ups_status  ON public.follow_ups(organization_id, status);

CREATE TRIGGER trg_follow_ups_updated_at
  BEFORE UPDATE ON public.follow_ups
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Auto-mark overdue: run as a scheduled job or DB function
-- This index supports the overdue query
CREATE INDEX idx_follow_ups_overdue ON public.follow_ups(due_at)
  WHERE status = 'pending';
