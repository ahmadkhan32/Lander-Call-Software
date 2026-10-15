-- ============================================================
-- Migration: 008_qa_and_audit.sql
-- Description: QA reviews, audit logs, notifications
-- ============================================================

-- ============================================================
-- QA REVIEWS
-- ============================================================
CREATE TABLE public.qa_reviews (
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

CREATE INDEX idx_qa_reviews_call     ON public.qa_reviews(call_id);
CREATE INDEX idx_qa_reviews_agent    ON public.qa_reviews(agent_id);
CREATE INDEX idx_qa_reviews_org      ON public.qa_reviews(organization_id);

CREATE TRIGGER trg_qa_reviews_updated_at
  BEFORE UPDATE ON public.qa_reviews
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- AUDIT LOGS
-- ============================================================
CREATE TABLE public.audit_logs (
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
CREATE INDEX idx_audit_logs_org      ON public.audit_logs(organization_id);
CREATE INDEX idx_audit_logs_actor    ON public.audit_logs(actor_id);
CREATE INDEX idx_audit_logs_action   ON public.audit_logs(action);
CREATE INDEX idx_audit_logs_created  ON public.audit_logs(created_at DESC);
CREATE INDEX idx_audit_logs_resource ON public.audit_logs(resource_type, resource_id);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================
CREATE TABLE public.notifications (
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

CREATE INDEX idx_notifications_recipient ON public.notifications(recipient_id, status);
CREATE INDEX idx_notifications_created   ON public.notifications(created_at DESC);
