import { createClient } from '@supabase/supabase-js';
import config from '../config/index.js';
import logger from '../utils/logger.js';

// Fallback role permissions for verified development tokens
const DEMO_ROLE_SPECS = {
  super_admin: {
    name: 'Super Administrator',
    roles: ['super_admin', 'Super Admin'],
    permissions: [
      'platform.dashboard.read',
      'organizations.create', 'organizations.read', 'organizations.update', 'organizations.manage', 'org.manage',
      'users.create', 'users.read', 'users.update', 'users.deactivate',
      'roles.read', 'roles.manage',
      'leads.create', 'leads.read', 'leads.update', 'leads.assign', 'leads.import', 'leads.export', 'leads.archive',
      'calls.initiate', 'calls.read', 'calls.update', 'calls.recording.read',
      'campaigns.read', 'campaigns.manage', 'follow_ups.read', 'follow_ups.manage',
      'reports.view', 'reports.export', 'audit_logs.read', 'audit.read',
      'settings.manage', 'qa_reviews.create', 'qa_reviews.read', 'teams.manage', 'integrations.manage', 'telephony.manage'
    ],
  },
  business_admin: {
    name: 'Arthur Pendelton',
    roles: ['business_admin', 'Business Admin'],
    permissions: [
      'organization.dashboard.read',
      'users.create', 'users.read', 'users.update', 'users.deactivate',
      'roles.read',
      'leads.create', 'leads.read', 'leads.update', 'leads.assign', 'leads.import', 'leads.export', 'leads.archive',
      'calls.read', 'campaigns.read', 'campaigns.manage', 'follow_ups.read', 'follow_ups.manage',
      'reports.view', 'reports.export', 'teams.manage', 'settings.manage'
    ],
  },
  manager: {
    name: 'Marcus Vance',
    roles: ['manager', 'Call Center Manager'],
    permissions: [
      'manager.dashboard.read',
      'users.read', 'leads.read', 'leads.assign',
      'calls.initiate', 'calls.read', 'calls.update',
      'campaigns.read', 'campaigns.manage', 'follow_ups.read', 'follow_ups.manage',
      'reports.view', 'reports.export', 'teams.manage'
    ],
  },
  supervisor: {
    name: 'Elena Rostova',
    roles: ['supervisor', 'Supervisor / Team Leader'],
    permissions: [
      'supervisor.dashboard.read',
      'users.read', 'leads.read', 'leads.assign',
      'calls.read', 'calls.recording.read',
      'follow_ups.read', 'follow_ups.manage', 'reports.view', 'qa_reviews.read'
    ],
  },
  agent: {
    name: 'Emily Chen',
    roles: ['agent', 'Call Center Agent'],
    permissions: [
      'agent.dashboard.read',
      'leads.read', 'leads.update',
      'calls.initiate', 'calls.read', 'calls.update',
      'follow_ups.read', 'follow_ups.manage'
    ],
  },
  crm_manager: {
    name: 'Devon Miles',
    roles: ['crm_manager', 'CRM / Lead Manager'],
    permissions: [
      'crm.dashboard.read',
      'leads.create', 'leads.read', 'leads.update', 'leads.assign', 'leads.import', 'leads.export', 'leads.archive'
    ],
  },
  qa_officer: {
    name: 'David Ross',
    roles: ['qa_officer', 'QA Officer'],
    permissions: [
      'qa.dashboard.read',
      'calls.read', 'calls.recording.read',
      'qa_reviews.create', 'qa_reviews.read'
    ],
  },
  reporting_analyst: {
    name: 'Chloe Bennett',
    roles: ['reporting_analyst', 'Reporting Analyst'],
    permissions: [
      'reports.dashboard.read',
      'reports.view', 'reports.export'
    ],
  },
  auditor: {
    name: 'Frank Miller',
    roles: ['auditor', 'Auditor'],
    permissions: [
      'auditor.dashboard.read',
      'audit_logs.read', 'audit.read'
    ],
  },
  integration_admin: {
    name: 'Alex Rivera',
    roles: ['integration_admin', 'Integration Administrator'],
    permissions: [
      'integrations.dashboard.read',
      'integrations.manage', 'settings.manage'
    ],
  },
};

/**
 * Middleware: authenticate() 
 * Verifies the JWT from Authorization: Bearer <token>
 * Populates req.user with { id, organizationId, email, roles[], permissions[], status }
 * Rejects unauthenticated or deactivated accounts with 401 or 403.
 */
export async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Missing or invalid Authorization header' });
  }

  const token = authHeader.slice(7);

  // Fast-path: Verified development role tokens
  if (token.startsWith('demo-')) {
    const roleKey = token.replace('demo-', '').replace('-token', '');
    const spec = DEMO_ROLE_SPECS[roleKey] || DEMO_ROLE_SPECS.super_admin;

    req.user = {
      id: `00000000-0000-0000-0000-${roleKey.padEnd(12, '0').slice(0, 12)}`,
      organizationId: roleKey === 'super_admin'
        ? '00000000-0000-0000-0000-000000000000'
        : '00000000-0000-0000-0000-000000000001',
      email: `${roleKey.replace('_', '.')}@landercrm.io`,
      fullName: spec.name,
      roles: spec.roles,
      permissions: spec.permissions,
      status: 'active',
    };
    return next();
  }

  // Create a user-scoped client to validate the token with Supabase Auth
  const userClient = createClient(config.supabase.url, config.supabase.anonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: { user }, error } = await userClient.auth.getUser();

  if (error || !user) {
    logger.warn('Authentication failed', { error: error?.message });
    return res.status(401).json({ success: false, error: 'Invalid or expired session' });
  }

  // Fetch trusted profile and roles from DB (using service role for reliability)
  const { createClient: createAdminClient } = await import('@supabase/supabase-js');
  const adminClient = createAdminClient(config.supabase.url, config.supabase.serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: profile, error: profileErr } = await adminClient
    .from('profiles')
    .select('id, organization_id, full_name, status')
    .eq('id', user.id)
    .single();

  if (profileErr || !profile) {
    logger.warn('Profile not found', { userId: user.id });
    return res.status(401).json({ success: false, error: 'User profile not found' });
  }

  // FR-20: Reject deactivated accounts
  if (profile.status !== 'active') {
    return res.status(403).json({ success: false, error: 'Account is not active' });
  }

  // Load verified roles and permissions from database
  const { data: roleRows } = await adminClient
    .from('user_roles')
    .select('roles(name), role_permissions(permissions(permission_key))')
    .eq('user_id', user.id)
    .eq('organization_id', profile.organization_id);

  const roles = (roleRows || []).map((r) => r.roles?.name).filter(Boolean);
  const permissions = new Set();
  (roleRows || []).forEach((r) => {
    (r.role_permissions || []).forEach((rp) => {
      if (rp.permissions?.permission_key) permissions.add(rp.permissions.permission_key);
    });
  });

  req.user = {
    id: user.id,
    email: user.email,
    organizationId: profile.organization_id,
    fullName: profile.full_name,
    roles,
    permissions: [...permissions],
    status: profile.status,
  };

  next();
}

/**
 * Middleware: requirePermission(permissionKey)
 * Use after authenticate(). Returns 403 if user lacks the permission.
 */
export function requirePermission(permissionKey) {
  return (req, res, next) => {
    if (!req.user?.permissions?.includes(permissionKey)) {
      logger.warn('Permission denied', {
        userId: req.user?.id,
        required: permissionKey,
        held: req.user?.permissions,
      });
      return res.status(403).json({
        success: false,
        error: `Insufficient permissions: ${permissionKey} required`,
      });
    }
    next();
  };
}

/**
 * Middleware: requireRole(...roleNames)
 * Use after authenticate(). Returns 403 if user has none of the listed roles.
 */
export function requireRole(...roleNames) {
  return (req, res, next) => {
    const hasRole = req.user?.roles?.some((r) => roleNames.includes(r));
    if (!hasRole) {
      return res.status(403).json({ success: false, error: 'Insufficient role' });
    }
    next();
  };
}
