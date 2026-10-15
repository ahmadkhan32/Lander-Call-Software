-- ============================================================
-- Migration: 004_customers.sql
-- Description: CRM customer records with contact details
-- ============================================================

CREATE TABLE public.customers (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID        NOT NULL REFERENCES public.organizations(id) ON DELETE RESTRICT,
  full_name       TEXT        NOT NULL,
  email           TEXT,
  phone           TEXT        NOT NULL,
  phone_alt       TEXT,
  company         TEXT,
  address         TEXT,
  city            TEXT,
  state           TEXT,
  country         TEXT        DEFAULT 'US',
  zip_code        TEXT,
  timezone        TEXT,
  language        TEXT        DEFAULT 'en',
  contact_pref    TEXT        DEFAULT 'any'
                    CHECK (contact_pref IN ('any','morning','afternoon','evening','do_not_call')),
  source          TEXT,
  tags            TEXT[]      DEFAULT '{}',
  notes           TEXT,
  status          TEXT        NOT NULL DEFAULT 'active'
                    CHECK (status IN ('active','inactive','do_not_call')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (organization_id, phone)
);

CREATE INDEX idx_customers_org    ON public.customers(organization_id);
CREATE INDEX idx_customers_email  ON public.customers(organization_id, email);
CREATE INDEX idx_customers_status ON public.customers(organization_id, status);

CREATE TRIGGER trg_customers_updated_at
  BEFORE UPDATE ON public.customers
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- CONTACT NOTES (interaction history per customer)
-- ============================================================
CREATE TABLE public.contact_notes (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID        NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  author_id   UUID        NOT NULL REFERENCES public.profiles(id)  ON DELETE RESTRICT,
  body        TEXT        NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_contact_notes_customer ON public.contact_notes(customer_id);

CREATE TRIGGER trg_contact_notes_updated_at
  BEFORE UPDATE ON public.contact_notes
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
