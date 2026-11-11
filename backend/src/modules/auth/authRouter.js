/**
 * authRouter.js
 * POST /api/auth/login  – Sign in, verify password, return JWT + profile + roles + permissions
 * POST /api/auth/logout – Sign out, invalidate session
 * GET  /api/auth/me     – Return current user profile + roles + permissions (verifies active status)
 * POST /api/auth/invite – Business Admin invites a user (creates invitation record)
 * POST /api/auth/accept-invite – User accepts invitation, sets individual password
 * POST /api/auth/forgot-password – Send password reset email
 */

import express from 'express';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';
import config from '../../config/index.js';
import supabase, { isSupabaseConfigured } from '../../config/supabase.js';
import { authenticate, requirePermission } from '../../middleware/auth.js';
import { auditRepository } from '../../repositories/auditRepository.js';
import { validateBody, successResponse, errorResponse } from '../../utils/helpers.js';
import logger from '../../utils/logger.js';

const router = express.Router();

// ── Verified Individual Accounts (Local/Demo Fallback Registry) ────────────────
export const INDIVIDUAL_ACCOUNTS = {
  'sarah.miller@landercrm.io': {
    password: 'SuperAdmin@2026!',
    fullName: 'Sarah Miller',
    role: 'super_admin',
    roles: ['super_admin'],
    organizationId: '00000000-0000-0000-0000-000000000000',
    status: 'active',
    permissions: [
      'platform.dashboard.read',
      'organizations.create', 'organizations.read', 'organizations.update', 'organizations.manage',
      'users.create', 'users.read', 'users.update', 'users.deactivate',
      'roles.read', 'roles.manage',
      'leads.create', 'leads.read', 'leads.update', 'leads.assign', 'leads.import', 'leads.export', 'leads.archive',
      'calls.initiate', 'calls.read', 'calls.update', 'calls.recording.read',
      'campaigns.manage', 'follow_ups.manage', 'reports.view', 'reports.export',
      'audit_logs.read', 'settings.manage', 'qa_reviews.create', 'qa_reviews.read',
      'teams.manage', 'integrations.manage',
    ],
  },
  'admin@callcenter.com': {
    password: 'BusinessAdmin@2026!',
    fullName: 'Arthur Pendelton',
    role: 'business_admin',
    roles: ['business_admin'],
    organizationId: '00000000-0000-0000-0000-000000000001',
    status: 'active',
    permissions: [
      'organization.dashboard.read',
      'users.create', 'users.read', 'users.update', 'users.deactivate',
      'roles.read',
      'leads.create', 'leads.read', 'leads.update', 'leads.assign', 'leads.import', 'leads.export', 'leads.archive',
      'calls.initiate', 'calls.read', 'calls.update', 'campaigns.manage', 'follow_ups.manage',
      'reports.view', 'reports.export', 'teams.manage', 'settings.manage',
    ],
  },
  'marcus.v@callcenter.com': {
    password: 'ManagerPass@2026!',
    fullName: 'Marcus Vance',
    role: 'manager',
    roles: ['manager'],
    organizationId: '00000000-0000-0000-0000-000000000001',
    status: 'active',
    permissions: [
      'manager.dashboard.read',
      'users.read',
      'leads.read', 'leads.assign',
      'calls.initiate', 'calls.read', 'calls.update',
      'campaigns.manage', 'follow_ups.manage',
      'reports.view', 'reports.export', 'teams.manage',
    ],
  },
  'elena.r@callcenter.com': {
    password: 'SupervisorPass@2026!',
    fullName: 'Elena Rostova',
    role: 'supervisor',
    roles: ['supervisor'],
    organizationId: '00000000-0000-0000-0000-000000000001',
    status: 'active',
    permissions: [
      'supervisor.dashboard.read',
      'users.read',
      'leads.read', 'leads.assign',
      'calls.initiate', 'calls.read', 'calls.update', 'calls.recording.read',
      'follow_ups.manage', 'reports.view', 'qa_reviews.read',
    ],
  },
  'emily.chen@callcenter.com': {
    password: 'AgentPass@2026!',
    fullName: 'Emily Chen',
    role: 'agent',
    roles: ['agent'],
    organizationId: '00000000-0000-0000-0000-000000000001',
    status: 'active',
    permissions: [
      'agent.dashboard.read',
      'leads.read', 'leads.update',
      'calls.initiate', 'calls.read', 'calls.update',
      'follow_ups.manage',
    ],
  },
  'devon.m@callcenter.com': {
    password: 'CrmManager@2026!',
    fullName: 'Devon Miles',
    role: 'crm_manager',
    roles: ['crm_manager'],
    organizationId: '00000000-0000-0000-0000-000000000001',
    status: 'active',
    permissions: [
      'crm.dashboard.read',
      'leads.create', 'leads.read', 'leads.update', 'leads.assign', 'leads.import', 'leads.export', 'leads.archive',
    ],
  },
  'david.ross@callcenter.com': {
    password: 'QaOfficer@2026!',
    fullName: 'David Ross',
    role: 'qa_officer',
    roles: ['qa_officer'],
    organizationId: '00000000-0000-0000-0000-000000000001',
    status: 'active',
    permissions: [
      'qa.dashboard.read',
      'calls.read', 'calls.recording.read',
      'qa_reviews.create', 'qa_reviews.read',
    ],
  },
  'chloe.b@callcenter.com': {
    password: 'AnalystPass@2026!',
    fullName: 'Chloe Bennett',
    role: 'reporting_analyst',
    roles: ['reporting_analyst'],
    organizationId: '00000000-0000-0000-0000-000000000001',
    status: 'active',
    permissions: [
      'reports.dashboard.read',
      'reports.view', 'reports.export',
    ],
  },
  'frank.audit@callcenter.com': {
    password: 'AuditorPass@2026!',
    fullName: 'Frank Miller',
    role: 'auditor',
    roles: ['auditor'],
    organizationId: '00000000-0000-0000-0000-000000000001',
    status: 'active',
    permissions: [
      'auditor.dashboard.read',
      'audit_logs.read',
    ],
  },
  'alex.telecom@callcenter.com': {
    password: 'IntegrationAdmin@2026!',
    fullName: 'Alex Rivera',
    role: 'integration_admin',
    roles: ['integration_admin'],
    organizationId: '00000000-0000-0000-0000-000000000001',
    status: 'active',
    permissions: [
      'integrations.dashboard.read',
      'integrations.manage', 'settings.manage',
    ],
  },
};

const ROLE_DASHBOARDS = {
  super_admin: '/super-admin/dashboard',
  business_admin: '/admin/dashboard',
  manager: '/manager/dashboard',
  supervisor: '/supervisor/dashboard',
  agent: '/agent/dashboard',
  crm_manager: '/crm/dashboard',
  qa_officer: '/qa/dashboard',
  reporting_analyst: '/reports/dashboard',
  auditor: '/auditor/dashboard',
  integration_admin: '/integrations/dashboard',
};

/**
 * Fetch user profile + roles + permissions using the service-role admin client.
 */
async function fetchUserContext(userId) {
  if (!isSupabaseConfigured) {
    return null;
  }

  const adminClient = createClient(config.supabase.url, config.supabase.serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: profile } = await adminClient
    .from('profiles')
    .select('id, organization_id, full_name, status')
    .eq('id', userId)
    .single();

  if (!profile || profile.status !== 'active') return null;

  const { data: roleRows } = await adminClient
    .from('user_roles')
    .select('roles(name), role_permissions(permissions(permission_key))')
    .eq('user_id', userId)
    .eq('organization_id', profile.organization_id);

  const roles = (roleRows || []).map((r) => r.roles?.name).filter(Boolean);
  const permSet = new Set();
  (roleRows || []).forEach((r) => {
    (r.role_permissions || []).forEach((rp) => {
      if (rp.permissions?.permission_key) permSet.add(rp.permissions.permission_key);
    });
  });

  return { profile, roles, permissions: [...permSet] };
}

// ── POST /api/auth/login ──────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  const schema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
  });

  const body = validateBody(schema, req.body, res);
  if (!body) return;

  const emailLower = body.email.toLowerCase().trim();

  // ── 1. Local / Demo Verification Mode ────────────────────────────────────────
  if (!isSupabaseConfigured) {
    const account = INDIVIDUAL_ACCOUNTS[emailLower];

    if (!account) {
      return errorResponse(res, 'Invalid email or password', 401);
    }

    // Verify Password
    if (account.password !== body.password) {
      return errorResponse(res, 'Invalid email or password', 401);
    }

    // Verify Active Account Status (FR-20)
    if (account.status !== 'active') {
      return errorResponse(res, 'Account is deactivated. Access denied.', 403);
    }

    const primaryRole = account.role;
    const redirectTo = ROLE_DASHBOARDS[primaryRole] || '/app/dashboard';

    return successResponse(res, {
      token: `demo-${primaryRole}-token`,
      user: {
        id: `usr_${primaryRole}_01`,
        email: emailLower,
        full_name: account.fullName,
        organization_id: account.organizationId,
        status: account.status,
        roles: account.roles,
        permissions: account.permissions,
      },
      redirectTo,
    });
  }

  // ── 2. Production Supabase Auth Verification ─────────────────────────────────
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: body.email,
      password: body.password,
    });

    if (error || !data?.user) {
      return errorResponse(res, 'Invalid email or password', 401);
    }

    const context = await fetchUserContext(data.user.id);
    if (!context) {
      return errorResponse(res, 'Account is deactivated or profile not found', 403);
    }

    if (context.profile.status !== 'active') {
      return errorResponse(res, 'Account is deactivated. Access denied.', 403);
    }

    const primaryRole = context.roles[0] || 'agent';
    const redirectTo = ROLE_DASHBOARDS[primaryRole] || '/app/dashboard';

    // Log successful login in immutable audit trail
    await auditRepository.log({
      organizationId: context.profile.organization_id,
      actorId: data.user.id,
      action: 'auth.login',
      resourceType: 'user',
      resourceId: data.user.id,
      newValue: { roles: context.roles },
      ipAddress: req.ip,
    }).catch(() => {});

    return successResponse(res, {
      token: data.session.access_token,
      refreshToken: data.session.refresh_token,
      user: {
        id: data.user.id,
        email: data.user.email,
        full_name: context.profile.full_name,
        organization_id: context.profile.organization_id,
        status: context.profile.status,
        roles: context.roles,
        permissions: context.permissions,
      },
      redirectTo,
    });
  } catch (err) {
    logger.error('Login error:', err);
    return errorResponse(res, 'Authentication failed', 500);
  }
});

// ── POST /api/auth/logout ─────────────────────────────────────────────────────
router.post('/logout', authenticate, async (req, res) => {
  try {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut().catch(() => {});
    }
    await auditRepository.log({
      organizationId: req.user.organizationId,
      actorId: req.user.id,
      action: 'auth.logout',
      resourceType: 'user',
      resourceId: req.user.id,
      ipAddress: req.ip,
    }).catch(() => {});
    return successResponse(res, { message: 'Signed out successfully' });
  } catch (err) {
    return errorResponse(res, 'Logout failed', 500);
  }
});

// ── GET /api/auth/me ──────────────────────────────────────────────────────────
router.get('/me', authenticate, async (req, res) => {
  if (req.user.status && req.user.status !== 'active') {
    return errorResponse(res, 'Account is deactivated', 403);
  }

  return successResponse(res, {
    user: {
      id: req.user.id,
      email: req.user.email,
      full_name: req.user.fullName,
      organization_id: req.user.organizationId,
      roles: req.user.roles,
      permissions: req.user.permissions,
      status: req.user.status || 'active',
    },
  });
});

// ── POST /api/auth/forgot-password ───────────────────────────────────────────
router.post('/forgot-password', async (req, res) => {
  const schema = z.object({ email: z.string().email() });
  const body = validateBody(schema, req.body, res);
  if (!body) return;

  if (!isSupabaseConfigured) {
    return successResponse(res, {
      message: 'If this email is registered, a password reset link has been sent.',
    });
  }

  try {
    const redirectTo = `${req.headers.origin || config.frontendUrl}/reset-password`;
    await supabase.auth.resetPasswordForEmail(body.email, { redirectTo });
    return successResponse(res, {
      message: 'If this email is registered, a password reset link has been sent.',
    });
  } catch (err) {
    logger.error('Forgot password error:', err);
    return errorResponse(res, 'Failed to send reset email', 500);
  }
});

// ── POST /api/auth/invite ─────────────────────────────────────────────────────
router.post('/invite', authenticate, requirePermission('users.create'), async (req, res) => {
  const schema = z.object({
    email: z.string().email(),
    role_name: z.string().default('agent'),
    full_name: z.string().optional(),
  });

  const body = validateBody(schema, req.body, res);
  if (!body) return;

  if (body.role_name === 'super_admin' && !req.user.roles?.includes('super_admin')) {
    return errorResponse(res, 'You are not authorized to invite a Super Admin', 403);
  }

  if (!isSupabaseConfigured) {
    return successResponse(res, {
      message: `Invitation sent to ${body.email} for role '${body.role_name}'`,
      invitation: {
        email: body.email,
        role: body.role_name,
        organization_id: req.user.organizationId,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
    }, 201);
  }

  try {
    const adminClient = createClient(config.supabase.url, config.supabase.serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data: roleRecord } = await adminClient
      .from('roles').select('id').eq('name', body.role_name).single();

    if (!roleRecord) return errorResponse(res, 'Role not found', 404);

    const token = crypto.randomUUID();
    const { data: invite, error: inviteErr } = await adminClient
      .from('organization_invitations')
      .insert({
        email: body.email,
        organization_id: req.user.organizationId,
        role_id: roleRecord.id,
        token_hash: token,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        invited_by: req.user.id,
      })
      .select()
      .single();

    if (inviteErr) return errorResponse(res, 'Failed to create invitation', 500);

    const redirectTo = `${req.headers.origin || config.frontendUrl}/accept-invite?token=${token}`;
    await adminClient.auth.admin.inviteUserByEmail(body.email, {
      redirectTo,
      data: {
        organization_id: req.user.organizationId,
        role_name: body.role_name,
        invited_by: req.user.email,
        full_name: body.full_name,
      },
    }).catch((e) => logger.warn('Supabase invite email error:', e));

    await auditRepository.log({
      organizationId: req.user.organizationId,
      actorId: req.user.id,
      action: 'users.invited',
      resourceType: 'invitation',
      resourceId: invite.id,
      newValue: { email: body.email, role: body.role_name },
      ipAddress: req.ip,
    });

    return successResponse(res, {
      message: `Invitation sent to ${body.email}`,
      invitation: invite,
    }, 201);
  } catch (err) {
    logger.error('Invite error:', err);
    return errorResponse(res, 'Failed to send invitation', 500);
  }
});

// ── POST /api/auth/accept-invite ──────────────────────────────────────────────
router.post('/accept-invite', async (req, res) => {
  const schema = z.object({
    token: z.string(),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    full_name: z.string().min(1),
  });

  const body = validateBody(schema, req.body, res);
  if (!body) return;

  if (!isSupabaseConfigured) {
    return successResponse(res, {
      message: 'Account activated. You can now log in.',
      email: 'invited.user@example.com',
    });
  }

  try {
    const adminClient = createClient(config.supabase.url, config.supabase.serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data: invite, error: inviteErr } = await adminClient
      .from('organization_invitations')
      .select('*, roles(name)')
      .eq('token_hash', body.token)
      .is('accepted_at', null)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (inviteErr || !invite) {
      return errorResponse(res, 'Invalid or expired invitation link', 400);
    }

    const { data: existingUsers } = await adminClient.auth.admin.listUsers();
    const existingUser = existingUsers?.users?.find((u) => u.email === invite.email);

    let authUserId;
    if (existingUser) {
      const { error: updateErr } = await adminClient.auth.admin.updateUserById(
        existingUser.id, { password: body.password }
      );
      if (updateErr) return errorResponse(res, 'Failed to set password', 500);
      authUserId = existingUser.id;
    } else {
      const { data: authUser, error: authErr } = await adminClient.auth.admin.createUser({
        email: invite.email,
        password: body.password,
        email_confirm: true,
        user_metadata: {
          full_name: body.full_name,
          organization_id: invite.organization_id,
        },
      });
      if (authErr) return errorResponse(res, authErr.message, 400);
      authUserId = authUser.user.id;
    }

    await adminClient.from('profiles').upsert({
      id: authUserId,
      organization_id: invite.organization_id,
      full_name: body.full_name,
      status: 'active',
    }, { onConflict: 'id' });

    await adminClient.from('user_roles').upsert({
      user_id: authUserId,
      role_id: invite.role_id,
      organization_id: invite.organization_id,
      granted_by: invite.invited_by,
    }, { onConflict: 'user_id,role_id,organization_id' });

    await adminClient.from('organization_invitations')
      .update({ accepted_at: new Date().toISOString() })
      .eq('id', invite.id);

    await auditRepository.log({
      organizationId: invite.organization_id,
      actorId: invite.invited_by,
      action: 'users.invite_accepted',
      resourceType: 'user',
      resourceId: authUserId,
      newValue: { email: invite.email, role: invite.roles?.name },
      ipAddress: req.ip,
    });

    return successResponse(res, {
      message: 'Account activated. You can now log in.',
      email: invite.email,
    });
  } catch (err) {
    logger.error('Accept invite error:', err);
    return errorResponse(res, 'Failed to process invitation', 500);
  }
});

export default router;
