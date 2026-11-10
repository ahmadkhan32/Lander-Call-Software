import express from 'express';
import { z } from 'zod';
import supabase, { isSupabaseConfigured } from '../../config/supabase.js';
import { auditRepository } from '../../repositories/auditRepository.js';
import { authenticate, requirePermission } from '../../middleware/auth.js';
import { parsePagination, successResponse, errorResponse, validateBody, handleDbError } from '../../utils/helpers.js';
import logger from '../../utils/logger.js';

const router = express.Router();

// GET /api/users
router.get('/', authenticate, requirePermission('users.read'), async (req, res) => {
  const { page, limit, offset } = parsePagination(req.query);
  const { status, search } = req.query;

  if (!isSupabaseConfigured) {
    const { demoData } = await import('../../utils/demoData.js');
    let list = [...demoData.users];
    if (status) list = list.filter((u) => u.status === status);
    if (search) list = list.filter((u) => u.full_name?.toLowerCase().includes(search.toLowerCase()));
    return successResponse(res, { users: list, pagination: { page, limit, total: list.length } });
  }

  let query = supabase
    .from('profiles')
    .select(`
      id, full_name, phone, status, timezone, created_at,
      user_roles ( roles ( name ) )
    `, { count: 'exact' })
    .eq('organization_id', req.user.organizationId)
    .order('full_name', { ascending: true })
    .range(offset, offset + limit - 1);

  if (status) query = query.eq('status', status);
  if (search) query = query.ilike('full_name', `%${search}%`);

  try {
    const { data, error, count } = await query;
    if (error) throw error;
    return successResponse(res, { users: data, pagination: { page, limit, total: count } });
  } catch {
    const { demoData } = await import('../../utils/demoData.js');
    let list = [...demoData.users];
    if (status) list = list.filter((u) => u.status === status);
    if (search) list = list.filter((u) => u.full_name?.toLowerCase().includes(search.toLowerCase()));
    return successResponse(res, { users: list, pagination: { page, limit, total: list.length } });
  }
});

// GET /api/users/:id
router.get('/:id', authenticate, requirePermission('users.read'), async (req, res) => {
  if (!isSupabaseConfigured) {
    const { demoData } = await import('../../utils/demoData.js');
    const u = demoData.users.find((u) => u.id === req.params.id) || demoData.users[0];
    return successResponse(res, { user: u });
  }
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*, user_roles ( role_id, roles ( name, description ) )')
      .eq('id', req.params.id)
      .eq('organization_id', req.user.organizationId)
      .single();

    if (error || !data) throw error;
    return successResponse(res, { user: data });
  } catch {
    const { demoData } = await import('../../utils/demoData.js');
    const u = demoData.users.find((u) => u.id === req.params.id) || demoData.users[0];
    return successResponse(res, { user: u });
  }
});

// GET /api/users/me
router.get('/me', authenticate, async (req, res) => {
  if (!isSupabaseConfigured) {
    return successResponse(res, {
      user: {
        id: req.user.id,
        email: req.user.email || 'superadmin@lander.crm',
        full_name: req.user.fullName || 'Super Administrator',
        status: 'active',
        roles: req.user.roles || ['Super Admin'],
        permissions: req.user.permissions || [],
      },
    });
  }
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*, user_roles ( roles ( name ) )')
      .eq('id', req.user.id)
      .single();

    if (error || !data) throw error;
    return successResponse(res, { user: { ...data, permissions: req.user.permissions } });
  } catch {
    return successResponse(res, {
      user: {
        id: req.user.id,
        email: req.user.email || 'superadmin@lander.crm',
        full_name: req.user.fullName || 'Super Administrator',
        status: 'active',
        roles: req.user.roles || ['Super Admin'],
        permissions: req.user.permissions || [],
      },
    });
  }
});


// PATCH /api/users/:id
router.patch('/:id', authenticate, requirePermission('users.update'), async (req, res) => {
  const schema = z.object({
    full_name: z.string().min(1).max(200).optional(),
    phone: z.string().optional().nullable(),
    timezone: z.string().optional(),
    status: z.enum(['active', 'inactive', 'suspended']).optional(),
  });

  const body = validateBody(schema, req.body, res);
  if (!body) return;

  const { data: old } = await supabase
    .from('profiles')
    .select('full_name, status')
    .eq('id', req.params.id)
    .eq('organization_id', req.user.organizationId)
    .single();

  if (!old) return errorResponse(res, 'User not found', 404);

  const { data, error } = await supabase
    .from('profiles')
    .update({ ...body, updated_at: new Date().toISOString() })
    .eq('id', req.params.id)
    .eq('organization_id', req.user.organizationId)
    .select()
    .single();

  if (error) return handleDbError(error, logger, res, 'Failed to update user');

  await auditRepository.log({
    organizationId: req.user.organizationId,
    actorId: req.user.id,
    action: 'users.updated',
    resourceType: 'user',
    resourceId: req.params.id,
    oldValue: old,
    newValue: body,
    ipAddress: req.ip,
  });

  return successResponse(res, { user: data });
});

// POST /api/users/:id/roles  (assign a role)
router.post('/:id/roles', authenticate, requirePermission('users.update'), async (req, res) => {
  const schema = z.object({ role_name: z.string() });
  const body = validateBody(schema, req.body, res);
  if (!body) return;

  const { data: role } = await supabase
    .from('roles')
    .select('id')
    .eq('name', body.role_name)
    .single();

  if (!role) return errorResponse(res, 'Role not found', 404);

  const { error } = await supabase.from('user_roles').upsert({
    user_id: req.params.id,
    role_id: role.id,
    organization_id: req.user.organizationId,
    granted_by: req.user.id,
  });

  if (error) return handleDbError(error, logger, res, 'Failed to assign role');

  await auditRepository.log({
    organizationId: req.user.organizationId,
    actorId: req.user.id,
    action: 'users.role_assigned',
    resourceType: 'user',
    resourceId: req.params.id,
    newValue: { role: body.role_name },
    ipAddress: req.ip,
  });

  return successResponse(res, { message: `Role '${body.role_name}' assigned` });
});

// POST /api/users (register user with login, password & role)
router.post('/', authenticate, requirePermission('users.create'), async (req, res) => {
  const schema = z.object({
    full_name: z.string().min(1).max(200),
    email: z.string().email(),
    password: z.string().min(6),
    role_name: z.string().default('agent'),
    phone: z.string().optional().nullable(),
    timezone: z.string().default('UTC'),
  });

  const body = validateBody(schema, req.body, res);
  if (!body) return;

  const targetOrgId = req.user.organizationId;

  // Prevent non-superadmins from creating superadmins
  if (body.role_name === 'super_admin' && !req.user.roles?.includes('Super Admin')) {
    return errorResponse(res, 'Unauthorized to create Super Admin account', 403);
  }

  if (!isSupabaseConfigured) {
    const newUser = {
      id: `usr_${Date.now()}`,
      full_name: body.full_name,
      email: body.email,
      phone: body.phone,
      status: 'active',
      timezone: body.timezone,
      roles: [body.role_name],
      organization_id: targetOrgId,
      created_at: new Date().toISOString(),
    };
    return successResponse(res, { user: newUser, message: `User ${body.email} registered successfully.` }, 201);
  }

  try {
    const { default: config } = await import('../../config/index.js');
    const { createClient: createAdminClient } = await import('@supabase/supabase-js');
    const adminClient = createAdminClient(config.supabase.url, config.supabase.serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // 1. Create auth user with password
    const { data: authUser, error: authErr } = await adminClient.auth.admin.createUser({
      email: body.email,
      password: body.password,
      email_confirm: true,
      user_metadata: { full_name: body.full_name, role: body.role_name, organization_id: targetOrgId },
    });

    if (authErr) return errorResponse(res, authErr.message, 400);

    // 2. Insert into profiles
    const { data: profile, error: profErr } = await adminClient.from('profiles').insert({
      id: authUser.user.id,
      organization_id: targetOrgId,
      full_name: body.full_name,
      phone: body.phone || null,
      timezone: body.timezone,
      status: 'active',
    }).select().single();

    if (profErr) return handleDbError(profErr, logger, res, 'Failed to create user profile');

    // 3. Resolve role and assign
    const { data: roleRecord } = await adminClient
      .from('roles')
      .select('id')
      .eq('name', body.role_name)
      .single();

    if (roleRecord) {
      await adminClient.from('user_roles').insert({
        user_id: authUser.user.id,
        role_id: roleRecord.id,
        organization_id: targetOrgId,
        granted_by: req.user.id,
      });
    }

    // 4. Audit Log
    await auditRepository.log({
      organizationId: targetOrgId,
      actorId: req.user.id,
      action: 'users.registered_with_credentials',
      resourceType: 'user',
      resourceId: authUser.user.id,
      newValue: { email: body.email, role: body.role_name },
      ipAddress: req.ip,
    });

    return successResponse(res, {
      user: {
        id: authUser.user.id,
        email: body.email,
        full_name: body.full_name,
        role: body.role_name,
      },
      message: `User ${body.email} registered with assigned role '${body.role_name}'`,
    }, 201);
  } catch (err) {
    logger.error('Error creating user:', err);
    return errorResponse(res, 'Internal server error while creating user', 500);
  }
});

export default router;
