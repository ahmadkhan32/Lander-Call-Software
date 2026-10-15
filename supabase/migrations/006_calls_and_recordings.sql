-- ============================================================
-- Migration: 006_calls_and_recordings.sql
-- Description: Calls, recordings, agent status history
-- ============================================================

-- ============================================================
-- CALLS
-- ============================================================
CREATE TABLE public.calls (
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

CREATE INDEX idx_calls_org        ON public.calls(organization_id);
CREATE INDEX idx_calls_lead       ON public.calls(lead_id);
CREATE INDEX idx_calls_agent      ON public.calls(agent_id);
CREATE INDEX idx_calls_campaign   ON public.calls(campaign_id);
CREATE INDEX idx_calls_started    ON public.calls(organization_id, started_at DESC);
CREATE INDEX idx_calls_provider   ON public.calls(provider, provider_call_id);

CREATE TRIGGER trg_calls_updated_at
  BEFORE UPDATE ON public.calls
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- CALL RECORDINGS
-- ============================================================
CREATE TABLE public.call_recordings (
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

CREATE INDEX idx_call_recordings_call ON public.call_recordings(call_id);

-- ============================================================
-- AGENT STATUS HISTORY
-- ============================================================
CREATE TABLE public.agent_status_history (
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

CREATE INDEX idx_agent_status_agent ON public.agent_status_history(agent_id);
CREATE INDEX idx_agent_status_org   ON public.agent_status_history(organization_id, started_at DESC);

-- ============================================================
-- WEBHOOK EVENTS (idempotency for telephony providers)
-- ============================================================
CREATE TABLE public.webhook_events (
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

CREATE INDEX idx_webhook_events_status   ON public.webhook_events(status);
CREATE INDEX idx_webhook_events_created  ON public.webhook_events(created_at DESC);
