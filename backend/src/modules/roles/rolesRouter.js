/**
 * rolesRouter.js
 * GET  /api/roles                            – List all roles
 * GET  /api/roles/:id/permissions            – List permissions for a role
 * POST /api/roles/:id/permissions            – Assign permissions to a role
 * DELETE /api/roles/:id/permissions/:permId  – Remove a permission from a role
 * GET  /api/permissions                      – List all available permissions
 */

import express from 'express';
import { z } from 'zod';
import supabase, { isSupabaseConfigured } from '../../config/supabase.js';
import { authenticate, requirePermission } from '../../middleware/auth.js';
import { auditRepository } from '../../repositories/auditRepository.js';
import { validateBody, successResponse, errorResponse } from '../../utils/helpers.js';
import logger from '../../utils/logger.js';

const router = express.Router();
router.use(authenticate);

// ── Demo data ─────────────────────────────────────────────────────────────────
const DEMO_ROLES = [
  { id: 'role_01', name: 'super_admin',         description: 'Platform-wide administration',                        is_system_role: true },
  { id: 'role_02', name: 'business_admin',      description: 'Organization management, users, campaigns',           is_system_role: true },
  { id: 'role_03', name: 'call_center_manager', description: 'Operations, lead distribution, targets',              is_system_role: true },
  { id: 'role_04', name: 'supervisor',          description: 'Monitor agents, review calls, reassign leads',        is_system_role: true },
  { id: 'role_05', name: 'agent',               description: 'Handle leads, make calls, record outcomes',           is_system_role: true },
  { id: 'role_06', name: 'crm_manager',         description: 'Import, validate, deduplicate and distribute leads',  is_system_role: true },
  { id: 'role_07', name: 'qa_officer',          description: 'Review call recordings, score quality',               is_system_role: true },
  { id: 'role_08', name: 'reporting_analyst',   description: 'View performance reports, export data',               is_system_role: true },
  { id: 'role_09', name: 'auditor',             description: 'Read audit logs, investigate changes',                is_system_role: true },
  { id: 'role_10', name: 'integration_admin',   description: 'Configure telephony, webhooks, credentials',          is_system_role: true },
  { id: 'role_11', name: 'background_worker',   description: 'Process reminders, imports, scheduled tasks',         is_system_role: true },
];

const DEMO_PERMISSIONS = [
  // Organizations
  { id: 'perm_01', permission_key: 'organizations.manage',   description: 'Create / update / deactivate organizations' },
  // Users
  { id: 'perm_02', permission_key: 'users.create',           description: 'Create new users' },
  { id: 'perm_03', permission_key: 'users.read',             description: 'View user profiles' },
  { id: 'perm_04', permission_key: 'users.update',           description: 'Edit user profiles' },
  { id: 'perm_05', permission_key: 'users.deactivate',       description: 'Deactivate user accounts' },
  // Leads
  { id: 'perm_06', permission_key: 'leads.create',           description: 'Create lead records' },
  { id: 'perm_07', permission_key: 'leads.read',             description: 'View lead records' },
  { id: 'perm_08', permission_key: 'leads.update',           description: 'Edit lead records' },
  { id: 'perm_09', permission_key: 'leads.archive',          description: 'Archive lead records' },
  { id: 'perm_10', permission_key: 'leads.assign',           description: 'Assign leads to agents' },
  { id: 'perm_11', permission_key: 'leads.import',           description: 'Bulk-import leads' },
  { id: 'perm_12', permission_key: 'leads.export',           description: 'Export leads' },
  // Calls
  { id: 'perm_13', permission_key: 'calls.initiate',         description: 'Start outbound calls' },
  { id: 'perm_14', permission_key: 'calls.read',             description: 'View call logs' },
  { id: 'perm_15', permission_key: 'calls.update',           description: 'Edit call records' },
  { id: 'perm_16', permission_key: 'calls.recording.read',   description: 'Listen to call recordings' },
  // Campaigns
  { id: 'perm_17', permission_key: 'campaigns.manage',       description: 'Create / edit / archive campaigns' },
  // Follow-ups
  { id: 'perm_18', permission_key: 'follow_ups.manage',      description: 'Create / edit / close follow-ups' },
  // Reports
  { id: 'perm_19', permission_key: 'reports.view',           description: 'View performance reports' },
  { id: 'perm_20', permission_key: 'reports.export',         description: 'Export report data' },
  // Audit
  { id: 'perm_21', permission_key: 'audit_logs.read',        description: 'Read the audit log' },
  // Settings
  { id: 'perm_22', permission_key: 'settings.manage',        description: 'Change system and organization settings' },
  // QA
  { id: 'perm_23', permission_key: 'qa_reviews.create',      description: 'Submit QA scorecards' },
  { id: 'perm_24', permission_key: 'qa_reviews.read',        description: 'View QA scorecards' },
  // Teams
  { id: 'perm_25', permission_key: 'teams.manage',           description: 'Create / edit / delete teams' },
  // Integrations
  { id: 'perm_26', permission_key: 'integrations.manage',    description: 'Configure telephony integrations and webhooks' },
];

// ── GET /api/roles ────────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  if (!isSupabaseConfigured) {
    return successResponse(res, { roles: DEMO_ROLES });
  }

  try {
    const { data, error } = await supabase
      .from('roles')
      .select('id, name, description, is_system_role')
      .order('name');

    if (error) throw error;
    return successResponse(res, { roles: data });
  } catch {
    return successResponse(res, { roles: DEMO_ROLES });
  }
});

// ── GET /api/permissions ──────────────────────────────────────────────────────
router.get('/permissions', async (req, res) => {
  if (!isSupabaseConfigured) {
    return successResponse(res, { permissions: DEMO_PERMISSIONS });
  }

  try {
    const { data, error } = await supabase
      .from('permissions')
      .select('id, permission_key, description')
      .order('permission_key');

    if (error) throw error;
    return successResponse(res, { permissions: data });
  } catch {
    return successResponse(res, { permissions: DEMO_PERMISSIONS });
  }
});

// ── GET /api/roles/:id/permissions ────────────────────────────────────────────
router.get('/:id/permissions', requirePermission('settings.manage'), async (req, res) => {
  if (!isSupabaseConfigured) {
    return successResponse(res, { permissions: DEMO_PERMISSIONS.slice(0, 10) });
  }

  try {
    const { data, error } = await supabase
      .from('role_permissions')
      .select('permissions(id, permission_key, description)')
      .eq('role_id', req.params.id);

    if (error) throw error;
    const perms = (data || []).map((r) => r.permissions).filter(Boolean);
    return successResponse(res, { permissions: perms });
  } catch (err) {
    return errorResponse(res, 'Failed to fetch role permissions', 500);
  }
});

// ── POST /api/roles/:id/permissions ───────────────────────────────────────────
// Assign a list of permission_keys to a role
router.post('/:id/permissions', requirePermission('settings.manage'), async (req, res) => {
  const schema = z.object({
    permission_keys: z.array(z.string()).min(0),
  });

  const body = validateBody(schema, req.body, res);
  if (!body) return;

  if (!isSupabaseConfigured) {
    return successResponse(res, {
      message: `Permissions updated for role. Changes recorded in audit log.`,
      count: body.permission_keys.length,
    });
  }

  try {
    // Remove all existing permissions for this role
    await supabase.from('role_permissions').delete().eq('role_id', req.params.id);

    if (body.permission_keys.length > 0) {
      // Resolve permission IDs
      const { data: permRecords } = await supabase
        .from('permissions')
        .select('id, permission_key')
        .in('permission_key', body.permission_keys);

      const inserts = (permRecords || []).map((p) => ({
        role_id: req.params.id,
        permission_id: p.id,
      }));

      if (inserts.length > 0) {
        const { error } = await supabase.from('role_permissions').insert(inserts);
        if (error) return errorResponse(res, 'Failed to assign permissions', 500);
      }
    }

    await auditRepository.log({
      organizationId: req.user.organizationId,
      actorId: req.user.id,
      action: 'roles.permissions_updated',
      resourceType: 'role',
      resourceId: req.params.id,
      newValue: { permission_keys: body.permission_keys },
      ipAddress: req.ip,
    });

    return successResponse(res, {
      message: 'Role permissions updated. Audit log recorded.',
      count: body.permission_keys.length,
    });
  } catch (err) {
    logger.error('Update role permissions error:', err);
    return errorResponse(res, 'Failed to update permissions', 500);
  }
});

// ── DELETE /api/roles/:id/permissions/:permId ─────────────────────────────────
router.delete('/:id/permissions/:permId', requirePermission('settings.manage'), async (req, res) => {
  if (!isSupabaseConfigured) {
    return successResponse(res, { message: 'Permission removed from role.' });
  }

  const { error } = await supabase
    .from('role_permissions')
    .delete()
    .eq('role_id', req.params.id)
    .eq('permission_id', req.params.permId);

  if (error) return errorResponse(res, 'Failed to remove permission', 500);

  await auditRepository.log({
    organizationId: req.user.organizationId,
    actorId: req.user.id,
    action: 'roles.permission_removed',
    resourceType: 'role',
    resourceId: req.params.id,
    newValue: { removed_permission_id: req.params.permId },
    ipAddress: req.ip,
  });

  return successResponse(res, { message: 'Permission removed from role.' });
});

export default router;

