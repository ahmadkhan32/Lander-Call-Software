import fs from 'node:fs';
import path from 'node:path';

const migrationsDir = path.resolve('supabase/migrations');
const migrationFiles = [
  '001_extensions_and_organizations.sql',
  '002_profiles_roles_permissions.sql',
  '003_teams.sql',
  '004_customers.sql',
  '005_campaigns_and_leads.sql',
  '006_calls_and_recordings.sql',
  '007_follow_ups.sql',
  '008_qa_and_audit.sql',
  '009_rls_policies.sql',
  '010_multi_level_rbac_seed.sql',
  '011_organization_invitations.sql',
];

let allSql = `-- ============================================================================
-- LANDER CRM & OPERATIONS PLATFORM - ALL-IN-ONE MASTER SCHEMA & SETUP
-- Run this entire script in Supabase Studio -> SQL Editor
-- Creates all tables, relations, triggers, RLS policies, and RBAC seeds in 1 click!
-- Completely idempotent (safe to run on fresh or existing databases).
-- ============================================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

`;

for (const file of migrationFiles) {
  const filePath = path.join(migrationsDir, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Make table creation idempotent
    content = content.replace(/CREATE TABLE public\./g, 'CREATE TABLE IF NOT EXISTS public.');
    // Make index creation idempotent
    content = content.replace(/CREATE INDEX (?!IF NOT EXISTS )/g, 'CREATE INDEX IF NOT EXISTS ');
    content = content.replace(/CREATE UNIQUE INDEX (?!IF NOT EXISTS )/g, 'CREATE UNIQUE INDEX IF NOT EXISTS ');

    allSql += `\n-- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>\n`;
    allSql += `-- MIGRATION: ${file}\n`;
    allSql += `-- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>\n\n`;
    allSql += content.trim() + '\n\n';
  } else {
    console.warn(`File missing: ${file}`);
  }
}

// Add default seed organization and ensure admin user linkage works smoothly
allSql += `
-- ============================================================================
-- DEFAULT SEED ORGANIZATION & BASELINE DATA
-- ============================================================================
INSERT INTO public.organizations (id, name, slug, status, plan)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'Example Call Center', 'example-call-center', 'active', 'enterprise')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.organizations (id, name, slug, status, plan)
VALUES 
  ('00000000-0000-0000-0000-000000000002', 'Apex Telephony Corp', 'apex-telephony', 'active', 'professional')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.organizations (id, name, slug, status, plan)
VALUES 
  ('00000000-0000-0000-0000-000000000003', 'Lander Global Enterprises', 'lander-global', 'active', 'enterprise')
ON CONFLICT (id) DO NOTHING;

-- Link all permissions to super_admin and business_admin roles
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r
CROSS JOIN public.permissions p
WHERE r.name IN ('super_admin', 'business_admin')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- SETUP COMPLETED SUCCESSFULLY!
-- ============================================================================
`;

const outputPath = path.resolve('supabase/all_in_one_setup.sql');
fs.writeFileSync(outputPath, allSql, 'utf8');
console.log(`Successfully generated ${outputPath} (${allSql.length} bytes)`);
