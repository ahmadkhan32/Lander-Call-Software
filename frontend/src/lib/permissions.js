export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  BUSINESS_ADMIN: 'business_admin',
  CALL_CENTER_MANAGER: 'manager',
  SUPERVISOR: 'supervisor',
  CALL_CENTER_AGENT: 'agent',
  CRM_LEAD_MANAGER: 'lead_manager',
  QA_OFFICER: 'qa_officer',
  REPORTING_ANALYST: 'reporting_analyst',
  AUDITOR: 'auditor',
  INTEGRATION_ADMIN: 'integration_admin',
  BACKGROUND_WORKER: 'background_worker',
};

export const ROLE_LABELS = {
  super_admin: 'Super Admin',
  business_admin: 'Business Owner / Admin',
  manager: 'Call Center Manager',
  supervisor: 'Supervisor / Team Leader',
  agent: 'Call Center Agent',
  lead_manager: 'CRM / Lead Manager',
  qa_officer: 'QA Officer',
  reporting_analyst: 'Reporting Analyst',
  auditor: 'Auditor',
  integration_admin: 'Integration Administrator',
  background_worker: 'Background Worker',
};

export const PERMISSIONS = {
  VIEW_DASHBOARD: [
    'super_admin',
    'business_admin',
    'manager',
    'supervisor',
    'agent',
    'lead_manager',
    'qa_officer',
    'reporting_analyst',
    'auditor',
    'integration_admin',
  ],
  MANAGE_LEADS: ['super_admin', 'business_admin', 'manager', 'lead_manager', 'supervisor', 'agent'],
  VIEW_CUSTOMERS: ['super_admin', 'business_admin', 'manager', 'lead_manager', 'supervisor', 'agent'],
  CALL_DIALER: ['super_admin', 'business_admin', 'manager', 'supervisor', 'agent'],
  VIEW_CALLS: ['super_admin', 'business_admin', 'manager', 'supervisor', 'agent', 'qa_officer'],
  VIEW_CAMPAIGNS: ['super_admin', 'business_admin', 'manager', 'supervisor', 'lead_manager'],
  MANAGE_CAMPAIGNS: ['super_admin', 'business_admin', 'manager'],
  VIEW_TEAMS: ['super_admin', 'business_admin', 'manager', 'supervisor'],
  MANAGE_TEAMS: ['super_admin', 'business_admin', 'manager'],
  VIEW_QA: ['super_admin', 'business_admin', 'manager', 'supervisor', 'qa_officer'],
  VIEW_REPORTS: ['super_admin', 'business_admin', 'manager', 'supervisor', 'reporting_analyst'],
  VIEW_AUDIT_LOGS: ['super_admin', 'auditor', 'business_admin'],
  MANAGE_INTEGRATIONS: ['super_admin', 'integration_admin', 'business_admin'],
  MANAGE_SETTINGS: ['super_admin', 'business_admin', 'integration_admin'],
  MANAGE_ORGANIZATIONS: ['super_admin'],
};

export function hasPermission(userRole, requiredRoles) {
  if (!userRole) return false;
  if (userRole === ROLES.SUPER_ADMIN) return true;
  return requiredRoles.includes(userRole);
}
