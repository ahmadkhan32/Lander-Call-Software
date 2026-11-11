/**
 * authRouter.js
 * POST /api/auth/login  – Sign in, return JWT + profile + roles
 * POST /api/auth/logout – Sign out
 * GET  /api/auth/me     – Return current user profile + roles + permissions
 * POST /api/auth/invite – Business Admin invites a user (creates invitation record)
 * POST /api/auth/accept-invite – User accepts invitation, sets password
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

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Fetch user profile + roles + permissions using the service-role admin client.
 * Falls back to demo data when Supabase is not configured.
 */
async function fetchUserContext(userId) {
  if (!isSupabaseConfigured) {
    return {
      profile: {
        id: userId,
        full_name: 'Demo Super Admin',
        organization_id: '00000000-0000-0000-0000-000000000001',
        status: 'active',
      },
      roles: ['super_admin'],
      permissions: [
        'organizations.manage',
        'users.create', 'users.read', 'users.update', 'users.deactivate',
        'leads.create', 'leads.read', 'leads.update', 'leads.assign', 'leads.import', 'leads.export', 'leads.archive',
        'calls.initiate', 'calls.read', 'calls.update', 'calls.recording.read',
        'campaigns.manage', 'follow_ups.manage',
        'reports.view', 'reports.export',
        'audit_logs.read', 'settings.manage',
        'qa_reviews.create', 'qa_reviews.read',
        'teams.manage', 'integrations.manage',
      ],
    };
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

  if (!isSupabaseConfigured) {
    // Demo mode: derive role from email pattern
    const email = body.email.toLowerCase();
    const role =
      email.includes('super') || email.includes('platform') ? 'super_admin'
      : email.includes('admin') || email.includes('business') ? 'business_admin'
      : email.includes('manager') ? 'manager'
      : email.includes('supervisor') ? 'supervisor'
      : email.includes('agent') ? 'agent'
      : email.includes('crm') ? 'crm_manager'
      : email.includes('qa') ? 'qa_officer'
      : email.includes('report') ? 'reporting_analyst'
      : email.includes('audit') ? 'auditor'
      : email.includes('integration') ? 'integration_admin'
      : 'agent';

    const ROLE_DASHBOARD = {
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

    return successResponse(res, {
      token: `demo-${role}-token`,
      user: {
        id: `usr_demo_${role}`,
        email: body.email,
        full_name: body.email.split('@')[0].replace(/[._]/g, ' '),
        organization_id: '00000000-0000-0000-0000-000000000001',
        status: 'active',
        roles: [role],
        permissions: [],
      },
      redirectTo: ROLE_DASHBOARD[role] || '/app/dashboard',
    });
  }

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
      return errorResponse(res, 'Account inactive or profile not found', 403);
    }

    const ROLE_DASHBOARD = {
      super_admin: '/super-admin/dashboard',
      business_admin: '/admin/dashboard',
      call_center_manager: '/manager/dashboard',
      supervisor: '/supervisor/dashboard',
      agent: '/agent/dashboard',
      crm_manager: '/crm/dashboard',
      qa_officer: '/qa/dashboard',
      reporting_analyst: '/reports/dashboard',
      auditor: '/auditor/dashboard',
      integration_admin: '/integrations/dashboard',
    };

    const primaryRole = context.roles[0] || 'agent';
    const redirectTo = ROLE_DASHBOARD[primaryRole] || '/app/dashboard';

    // Log successful login
    await auditRepository.log({
      organizationId: context.profile.organization_id,
      actorId: data.user.id,
      action: 'auth.login',
      resourceType: 'user',
      resourceId: data.user.id,
      newValue: { roles: context.roles },
      ipAddress: req.ip,
    }).catch(() => {}); // Non-blocking

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
  return successResponse(res, {
    user: {
      id: req.user.id,
      email: req.user.email,
      full_name: req.user.fullName,
      organization_id: req.user.organizationId,
      roles: req.user.roles,
      permissions: req.user.permissions,
    },
  });
});

// ── POST /api/auth/forgot-password ───────────────────────────────────────────
router.post('/forgot-password', async (req, res) => {
  const schema = z.object({ email: z.string().email() });
  const body = validateBody(schema, req.body, res);
  if (!body) return;

  if (!isSupabaseConfigured) {
    // In demo mode, pretend we sent the email
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
// Business Admin invites a user to join their organization
router.post('/invite', authenticate, requirePermission('users.create'), async (req, res) => {
  const schema = z.object({
    email: z.string().email(),
    role_name: z.string().default('agent'),
    full_name: z.string().optional(),
  });

  const body = validateBody(schema, req.body, res);
  if (!body) return;

  // Guard: prevent inviting super_admin
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

    // Resolve role ID
    const { data: roleRecord } = await adminClient
      .from('roles').select('id').eq('name', body.role_name).single();

    if (!roleRecord) return errorResponse(res, 'Role not found', 404);

    // Create invitation record
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

    // Send invitation email via Supabase auth
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

    // Audit log
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
// User accepts invitation, sets their password, activates account
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

    // Look up invitation
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

    // Check if user already exists
    const { data: existingUsers } = await adminClient.auth.admin.listUsers();
    const existingUser = existingUsers?.users?.find((u) => u.email === invite.email);

    let authUserId;
    if (existingUser) {
      // Update password for existing user
      const { data: updated, error: updateErr } = await adminClient.auth.admin.updateUserById(
        existingUser.id, { password: body.password }
      );
      if (updateErr) return errorResponse(res, 'Failed to set password', 500);
      authUserId = existingUser.id;
    } else {
      // Create auth user
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

    // Create / update profile
    await adminClient.from('profiles').upsert({
      id: authUserId,
      organization_id: invite.organization_id,
      full_name: body.full_name,
      status: 'active',
    }, { onConflict: 'id' });

    // Assign role
    await adminClient.from('user_roles').upsert({
      user_id: authUserId,
      role_id: invite.role_id,
      organization_id: invite.organization_id,
      granted_by: invite.invited_by,
    }, { onConflict: 'user_id,role_id,organization_id' });

    // Mark invitation as accepted
    await adminClient.from('organization_invitations')
      .update({ accepted_at: new Date().toISOString() })
      .eq('id', invite.id);

    // Audit log
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

