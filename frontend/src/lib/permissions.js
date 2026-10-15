export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  MANAGER: 'manager',
  AGENT: 'agent',
  QA_AUDITOR: 'qa_auditor',
};

export const PERMISSIONS = {
  VIEW_DASHBOARD: ['super_admin', 'admin', 'manager', 'agent', 'qa_auditor'],
  MANAGE_LEADS: ['super_admin', 'admin', 'manager', 'agent'],
  VIEW_CUSTOMERS: ['super_admin', 'admin', 'manager', 'agent'],
  CALL_DIALER: ['super_admin', 'admin', 'manager', 'agent'],
  VIEW_CAMPAIGNS: ['super_admin', 'admin', 'manager', 'agent'],
  MANAGE_CAMPAIGNS: ['super_admin', 'admin', 'manager'],
  VIEW_TEAMS: ['super_admin', 'admin', 'manager'],
  MANAGE_TEAMS: ['super_admin', 'admin'],
  VIEW_QA: ['super_admin', 'admin', 'manager', 'qa_auditor'],
  VIEW_REPORTS: ['super_admin', 'admin', 'manager'],
  MANAGE_SETTINGS: ['super_admin', 'admin'],
  MANAGE_ROLES: ['super_admin'],
  MANAGE_ORGANIZATION: ['super_admin', 'admin'],
};

export function hasPermission(userRole, requiredRoles) {
  if (!userRole) return false;
  if (userRole === ROLES.SUPER_ADMIN) return true;
  return requiredRoles.includes(userRole);
}
