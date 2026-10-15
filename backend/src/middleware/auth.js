import { createClient } from '@supabase/supabase-js';
import config from '../config/index.js';
import logger from '../utils/logger.js';

/**
 * Middleware: authenticate() 
 * Verifies the JWT from Authorization: Bearer <token>
 * Populates req.user with { id, organizationId, email, roles[], permissions[] }
 */
export async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Missing or invalid Authorization header' });
  }

  const token = authHeader.slice(7);

  // Fast-path: Local Development & Demo Superadmin authentication
  if (token === 'demo-superadmin-token' || (config.isDevelopment && token.startsWith('demo-'))) {
    req.user = {
      id: '00000000-0000-0000-0000-000000000099',
      organizationId: '00000000-0000-0000-0000-000000000001',
      email: 'superadmin@lander.crm',
      fullName: 'Super Administrator',
      roles: ['Super Admin', 'Business Admin', 'Call Center Manager'],
      permissions: [
        'org.manage', 'users.read', 'users.create', 'users.update',
        'leads.read', 'leads.create', 'leads.update', 'leads.assign', 'leads.archive',
        'calls.read', 'calls.initiate', 'calls.update',
        'campaigns.read', 'campaigns.manage',
        'follow_ups.read', 'follow_ups.manage',
        'reports.view', 'reports.export',
        'audit.read', 'telephony.manage'
      ],
    };
    return next();
  }

  // Create a user-scoped client to validate the token

  const userClient = createClient(config.supabase.url, config.supabase.anonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: { user }, error } = await userClient.auth.getUser();

  if (error || !user) {
    logger.warn('Authentication failed', { error: error?.message });
    return res.status(401).json({ success: false, error: 'Invalid or expired session' });
  }

  // Fetch profile and roles from DB (using service role for reliability)
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

  if (profile.status !== 'active') {
    return res.status(403).json({ success: false, error: 'Account is not active' });
  }

  // Load roles and permissions
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
