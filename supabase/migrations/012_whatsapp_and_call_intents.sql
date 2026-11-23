-- ============================================================
-- Migration: 012_whatsapp_and_call_intents.sql
-- Description: WhatsApp messaging, call intents, and communications audit
-- Fully compatible with Supabase PostgreSQL & Multi-tenant RBAC
-- ============================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- MESSAGES (WhatsApp & SMS)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.messages (
  id                   UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id      UUID        NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  lead_id              UUID        REFERENCES public.leads(id) ON DELETE SET NULL,
  agent_id             UUID        REFERENCES public.profiles(id) ON DELETE SET NULL,
  provider             TEXT        NOT NULL DEFAULT 'twilio',
  provider_message_sid TEXT        UNIQUE,
  channel              TEXT        NOT NULL DEFAULT 'whatsapp' CHECK (channel IN ('whatsapp', 'sms')),
  direction            TEXT        NOT NULL CHECK (direction IN ('inbound', 'outbound')),
  from_number          TEXT        NOT NULL,
  to_number            TEXT        NOT NULL,
  body                 TEXT        NOT NULL,
  status               TEXT        NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'sent', 'delivered', 'read', 'failed', 'received')),
  metadata             JSONB       DEFAULT '{}'::jsonb,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_org       ON public.messages (organization_id);
CREATE INDEX IF NOT EXISTS idx_messages_lead      ON public.messages (lead_id);
CREATE INDEX IF NOT EXISTS idx_messages_agent     ON public.messages (agent_id);
CREATE INDEX IF NOT EXISTS idx_messages_created   ON public.messages (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_provider  ON public.messages (provider_message_sid);

DROP TRIGGER IF EXISTS trg_messages_updated_at ON public.messages;
CREATE TRIGGER trg_messages_updated_at BEFORE UPDATE ON public.messages
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Alias view for crm_messages compatibility
CREATE OR REPLACE VIEW public.crm_messages AS
  SELECT * FROM public.messages;

-- Alias view for crm_calls compatibility
CREATE OR REPLACE VIEW public.crm_calls AS
  SELECT * FROM public.calls;

-- ============================================================
-- CRM CALL INTENTS (Secures WebRTC browser token bridging)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.crm_call_intents (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID        NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  agent_id        UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  lead_id         UUID        REFERENCES public.leads(id) ON DELETE SET NULL,
  destination     TEXT        NOT NULL,
  source_number   TEXT        NOT NULL,
  consumed_at     TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_call_intents_org     ON public.crm_call_intents (organization_id);
CREATE INDEX IF NOT EXISTS idx_call_intents_agent   ON public.crm_call_intents (agent_id);
CREATE INDEX IF NOT EXISTS idx_call_intents_pending ON public.crm_call_intents (id) WHERE consumed_at IS NULL;

-- Alias view for crm_communication_audit compatibility
CREATE OR REPLACE VIEW public.crm_communication_audit AS
  SELECT * FROM public.audit_logs;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_call_intents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "messages_org_select" ON public.messages;
CREATE POLICY "messages_org_select" ON public.messages FOR SELECT
  USING (organization_id = public.current_org_id());

DROP POLICY IF EXISTS "messages_org_insert" ON public.messages;
CREATE POLICY "messages_org_insert" ON public.messages FOR INSERT
  WITH CHECK (organization_id = public.current_org_id());

DROP POLICY IF EXISTS "messages_org_update" ON public.messages;
CREATE POLICY "messages_org_update" ON public.messages FOR UPDATE
  USING (organization_id = public.current_org_id());

DROP POLICY IF EXISTS "messages_org_delete" ON public.messages;
CREATE POLICY "messages_org_delete" ON public.messages FOR DELETE
  USING (organization_id = public.current_org_id() AND public.has_permission('leads.archive'));

DROP POLICY IF EXISTS "call_intents_org_all" ON public.crm_call_intents;
CREATE POLICY "call_intents_org_all" ON public.crm_call_intents FOR ALL
  USING (organization_id = public.current_org_id());
