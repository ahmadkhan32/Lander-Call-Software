/**
 * organizationsRouter.js
 * GET    /api/organizations           – List all orgs (super_admin only)
 * POST   /api/organizations           – Create org + provision Business Admin
 * GET    /api/organizations/:id       – Get org detail
 * PATCH  /api/organizations/:id       – Update org settings
 * PATCH  /api/organizations/:id/status – Activate / deactivate org
 */

import express from 'express';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';
import config from '../../config/index.js';
import supabase, { isSupabaseConfigured } from '../../config/supabase.js';
import { authenticate, requirePermission } from '../../middleware/auth.js';
import { auditRepository } from '../../repositories/auditRepository.js';
import { validateBody, successResponse, errorResponse, handleDbError } from '../../utils/helpers.js';
import logger from '../../utils/logger.js';

const router = express.Router();

// All org routes require auth and organizations.manage permission
router.use(authenticate);

// Demo organizations data
const DEMO_ORGS = [
  {
    id: 'org_001',
    name: 'Example Call Center',
    slug: 'example-call-center',
    status: 'active',
    subscription_tier: 'enterprise',
    max_seats: 100,
    admin_name: 'Arthur Pendelton',
    admin_email: 'admin@callcenter.com',
    created_at: '2024-01-15T00:00:00Z',
  },
  {
    id: 'org_002',
    name: 'Apex Telephony Corp',
    slug: 'apex-telephony',
    status: 'active',
    subscription_tier: 'pro',
    max_seats: 50,
    admin_name: 'Marcus Bell',
    admin_email: 'admin@apexcall.com',
    created_at: '2024-02-20T00:00:00Z',
  },
  {
    id: 'org_003',
    name: 'Lander Global Enterprises',
    slug: 'lander-global',
    status: 'active',
    subscription_tier: 'enterprise',
    max_seats: 200,
    admin_name: 'Sarah Miller',
    admin_email: 'admin@landercrm.io',
    created_at: '2024-01-01T00:00:00Z',
  },
];

// ── GET /api/organizations ────────────────────────────────────────────────────
router.get('/', requirePermission('organizations.manage'), async (req, res) => {
  if (!isSupabaseConfigured) {
    return successResponse(res, { organizations: DEMO_ORGS, total: DEMO_ORGS.length });
  }

  try {
    const { data, error, count } = await supabase
      .from('organizations')
      .select('*', { count: 'exact' })
      .order('name', { ascending: true });

    if (error) throw error;
    return successResponse(res, { organizations: data, total: count });
  } catch (err) {
    logger.warn('DB not available, returning demo orgs:', err.message);
    return successResponse(res, { organizations: DEMO_ORGS, total: DEMO_ORGS.length });
  }
});

// ── GET /api/organizations/:id ────────────────────────────────────────────────
router.get('/:id', requirePermission('organizations.manage'), async (req, res) => {
  if (!isSupabaseConfigured) {
    const org = DEMO_ORGS.find((o) => o.id === req.params.id) || DEMO_ORGS[0];
    return successResponse(res, { organization: org });
  }

  try {
    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error || !data) return errorResponse(res, 'Organization not found', 404);
    return successResponse(res, { organization: data });
  } catch {
    return errorResponse(res, 'Failed to fetch organization', 500);
  }
});

// ── POST /api/organizations ───────────────────────────────────────────────────
// Super Admin creates a new organization and provisions its Business Admin
router.post('/', requirePermission('organizations.manage'), async (req, res) => {
  const schema = z.object({
    name: z.string().min(2).max(200),
    slug: z.string().min(2).max(100).regex(/^[a-z0-9-]+$/).optional(),
    subscription_tier: z.enum(['standard', 'pro', 'enterprise']).default('standard'),
    max_seats: z.number().int().min(1).default(25),
    admin_name: z.string().min(1),
    admin_email: z.string().email(),
    admin_password: z.string().min(8),
  });

  const body = validateBody(schema, req.body, res);
  if (!body) return;

  const slug = body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  if (!isSupabaseConfigured) {
    const newOrg = {
      id: `org_${Date.now()}`,
      name: body.name,
      slug,
      status: 'active',
      subscription_tier: body.subscription_tier,
      max_seats: body.max_seats,
      admin_name: body.admin_name,
      admin_email: body.admin_email,
      created_at: new Date().toISOString(),
    };
    return successResponse(res, {
      organization: newOrg,
      admin: { email: body.admin_email, role: 'business_admin', dashboardUrl: '/admin/dashboard' },
      message: `Organization '${body.name}' provisioned with Business Admin.`,
    }, 201);
  }

  try {
    const adminClient = createClient(config.supabase.url, config.supabase.serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // 1. Create the organization record
    const { data: org, error: orgErr } = await adminClient
      .from('organizations')
      .insert({
        name: body.name,
        slug,
        status: 'active',
        subscription_tier: body.subscription_tier,
        max_seats: body.max_seats,
      })
      .select()
      .single();

    if (orgErr) return handleDbError(orgErr, logger, res, 'Failed to create organization');

    // 2. Create auth user for Business Admin
    const { data: authUser, error: authErr } = await adminClient.auth.admin.createUser({
      email: body.admin_email,
      password: body.admin_password,
      email_confirm: true,
      user_metadata: { full_name: body.admin_name, organization_id: org.id, role: 'business_admin' },
    });

    if (authErr) {
      // Rollback org
      await adminClient.from('organizations').delete().eq('id', org.id);
      return errorResponse(res, authErr.message, 400);
    }

    // 3. Create profile for Business Admin
    await adminClient.from('profiles').insert({
      id: authUser.user.id,
      organization_id: org.id,
      full_name: body.admin_name,
      status: 'active',
    });

    // 4. Assign business_admin role
    const { data: roleRecord } = await adminClient
      .from('roles').select('id').eq('name', 'business_admin').single();

    if (roleRecord) {
      await adminClient.from('user_roles').insert({
        user_id: authUser.user.id,
        role_id: roleRecord.id,
        organization_id: org.id,
        granted_by: req.user.id,
      });
    }

    // 5. Audit log
    await auditRepository.log({
      organizationId: req.user.organizationId,
      actorId: req.user.id,
      action: 'organizations.created',
      resourceType: 'organization',
      resourceId: org.id,
      newValue: { name: body.name, admin_email: body.admin_email },
      ipAddress: req.ip,
    });

    return successResponse(res, {
      organization: org,
      admin: {
        id: authUser.user.id,
        email: body.admin_email,
        role: 'business_admin',
        dashboardUrl: '/admin/dashboard',
      },
      message: `Organization '${body.name}' provisioned with Business Admin.`,
    }, 201);
  } catch (err) {
    logger.error('Create org error:', err);
    return errorResponse(res, 'Failed to provision organization', 500);
  }
});

// ── PATCH /api/organizations/:id ──────────────────────────────────────────────
router.patch('/:id', requirePermission('organizations.manage'), async (req, res) => {
  const schema = z.object({
    name: z.string().min(2).max(200).optional(),
    subscription_tier: z.enum(['standard', 'pro', 'enterprise']).optional(),
    max_seats: z.number().int().min(1).optional(),
    status: z.enum(['active', 'inactive', 'suspended']).optional(),
  });

  const body = validateBody(schema, req.body, res);
  if (!body) return;

  if (!isSupabaseConfigured) {
    return successResponse(res, { organization: { id: req.params.id, ...body } });
  }

  try {
    const { data, error } = await supabase
      .from('organizations')
      .update({ ...body, updated_at: new Date().toISOString() })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) return handleDbError(error, logger, res, 'Failed to update organization');

    await auditRepository.log({
      organizationId: req.user.organizationId,
      actorId: req.user.id,
      action: 'organizations.updated',
      resourceType: 'organization',
      resourceId: req.params.id,
      newValue: body,
      ipAddress: req.ip,
    });

    return successResponse(res, { organization: data });
  } catch (err) {
    return errorResponse(res, 'Failed to update organization', 500);
  }
});

export default router;

