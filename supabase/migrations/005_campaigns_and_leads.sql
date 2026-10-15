-- ============================================================
-- Migration: 005_campaigns_and_leads.sql
-- Description: Campaigns, lead sources, and leads
-- ============================================================

-- ============================================================
-- LEAD SOURCES
-- ============================================================
CREATE TABLE public.lead_sources (
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
CREATE TABLE public.campaigns (
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

CREATE INDEX idx_campaigns_org    ON public.campaigns(organization_id);
CREATE INDEX idx_campaigns_status ON public.campaigns(organization_id, status);

CREATE TRIGGER trg_campaigns_updated_at
  BEFORE UPDATE ON public.campaigns
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- CALL DISPOSITIONS (outcome definitions)
-- ============================================================
CREATE TABLE public.call_dispositions (
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
CREATE TABLE public.leads (
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

CREATE INDEX idx_leads_org_status   ON public.leads(organization_id, status);
CREATE INDEX idx_leads_assigned     ON public.leads(assigned_agent_id);
CREATE INDEX idx_leads_campaign     ON public.leads(campaign_id);
CREATE INDEX idx_leads_phone        ON public.leads(organization_id, phone);
CREATE INDEX idx_leads_score        ON public.leads(organization_id, score DESC);
CREATE INDEX idx_leads_next_contact ON public.leads(organization_id, next_contact_at);

CREATE TRIGGER trg_leads_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
