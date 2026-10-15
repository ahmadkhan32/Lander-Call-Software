-- ============================================================
-- Seed data: seed.sql
-- Description: Development/demo data for local testing
-- ============================================================

-- NOTE: Run AFTER all migrations. Uses fixed UUIDs for repeatability.
-- Auth users must be created via Supabase Auth; these are placeholder references.

-- Demo organization
INSERT INTO public.organizations (id, name, slug, status, plan) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Lander Demo Corp', 'lander-demo', 'active', 'professional')
ON CONFLICT DO NOTHING;

-- Demo subscription
INSERT INTO public.subscriptions (organization_id, plan, status)
VALUES ('00000000-0000-0000-0000-000000000001', 'professional', 'active')
ON CONFLICT DO NOTHING;

-- Call disposition extras (defaults already seeded in migration 005)
-- Lead sources
INSERT INTO public.lead_sources (organization_id, name, channel) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Website Form',     'web'),
  ('00000000-0000-0000-0000-000000000001', 'Facebook Ads',     'paid_ads'),
  ('00000000-0000-0000-0000-000000000001', 'Referral Program', 'referral'),
  ('00000000-0000-0000-0000-000000000001', 'Cold Import',      'import')
ON CONFLICT DO NOTHING;

-- Demo campaign
INSERT INTO public.campaigns (id, organization_id, name, type, status, goal) VALUES
  ('00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000001',
   'Q4 Outbound Campaign', 'outbound', 'active', 'Convert warm leads to customers')
ON CONFLICT DO NOTHING;
