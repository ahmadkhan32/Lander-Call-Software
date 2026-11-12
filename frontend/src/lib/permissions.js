export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  BUSINESS_ADMIN: 'business_admin',
  CALL_CENTER_MANAGER: 'manager',
  SUPERVISOR: 'supervisor',
  CALL_CENTER_AGENT: 'agent',
  CRM_LEAD_MANAGER: 'crm_manager',
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
  crm_manager: 'CRM / Lead Manager',
  qa_officer: 'QA Officer',
  reporting_analyst: 'Reporting Analyst',
  auditor: 'Auditor',
  integration_admin: 'Integration Administrator',
  background_worker: 'Background Worker',
};

export const ROLE_DASHBOARD_ROUTES = {
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

// Granular Permission Keys matching LANDER CRM specification
export const PERMISSION_KEYS = {
  DASHBOARDS: {
    PLATFORM: 'platform.dashboard.read',
    ORGANIZATION: 'organization.dashboard.read',
    MANAGER: 'manager.dashboard.read',
    SUPERVISOR: 'supervisor.dashboard.read',
    AGENT: 'agent.dashboard.read',
    CRM: 'crm.dashboard.read',
    QA: 'qa.dashboard.read',
    REPORTS: 'reports.dashboard.read',
    AUDITOR: 'auditor.dashboard.read',
    INTEGRATIONS: 'integrations.dashboard.read',
  },
  ORGANIZATIONS: {
    CREATE: 'organizations.create',
    READ: 'organizations.read',
    UPDATE: 'organizations.update',
    MANAGE: 'organizations.manage',
  },
  USERS: {
    CREATE: 'users.create',
    READ: 'users.read',
    UPDATE: 'users.update',
    DEACTIVATE: 'users.deactivate',
  },
  LEADS: {
    CREATE: 'leads.create',
    READ: 'leads.read',
    UPDATE: 'leads.update',
    ASSIGN: 'leads.assign',
    IMPORT: 'leads.import',
    EXPORT: 'leads.export',
    ARCHIVE: 'leads.archive',
  },
  CALLS: {
    INITIATE: 'calls.initiate',
    READ: 'calls.read',
    UPDATE: 'calls.update',
    RECORDING_READ: 'calls.recording.read',
  },
  REPORTS: {
    VIEW: 'reports.view',
    EXPORT: 'reports.export',
  },
  AUDIT: {
    READ: 'audit_logs.read',
  },
  INTEGRATIONS: {
    READ: 'integrations.read',
    MANAGE: 'integrations.manage',
  },
};

// Module-level RBAC role access matrix
export const PERMISSIONS = {
  // Dashboards
  VIEW_SUPER_ADMIN_DASHBOARD: ['super_admin'],
  VIEW_BUSINESS_ADMIN_DASHBOARD: ['business_admin', 'super_admin'],
  VIEW_MANAGER_DASHBOARD: ['manager', 'business_admin', 'super_admin'],
  VIEW_SUPERVISOR_DASHBOARD: ['supervisor', 'manager', 'business_admin', 'super_admin'],
  VIEW_AGENT_DASHBOARD: ['agent', 'supervisor', 'manager', 'business_admin', 'super_admin'],
  VIEW_CRM_DASHBOARD: ['crm_manager', 'business_admin', 'super_admin'],
  VIEW_QA_DASHBOARD: ['qa_officer', 'business_admin', 'super_admin'],
  VIEW_REPORTS_DASHBOARD: ['reporting_analyst', 'manager', 'business_admin', 'super_admin'],
  VIEW_AUDITOR_DASHBOARD: ['auditor', 'super_admin', 'business_admin'],
  VIEW_INTEGRATIONS_DASHBOARD: ['integration_admin', 'business_admin', 'super_admin'],

  VIEW_DASHBOARD: [
    'super_admin',
    'business_admin',
    'manager',
    'supervisor',
    'agent',
    'crm_manager',
    'qa_officer',
    'reporting_analyst',
    'auditor',
    'integration_admin',
  ],
  MANAGE_USERS: ['super_admin', 'business_admin'],
  VIEW_USERS: ['super_admin', 'business_admin', 'manager', 'supervisor'],
  MANAGE_ROLES_PERMISSIONS: ['super_admin', 'business_admin'],
  MANAGE_LEADS: ['super_admin', 'business_admin', 'manager', 'crm_manager', 'supervisor', 'agent'],
  VIEW_CUSTOMERS: ['super_admin', 'business_admin', 'manager', 'crm_manager', 'supervisor', 'agent'],
  CALL_DIALER: ['super_admin', 'business_admin', 'manager', 'supervisor', 'agent'],
  VIEW_CALLS: ['super_admin', 'business_admin', 'manager', 'supervisor', 'agent', 'qa_officer'],
  VIEW_CAMPAIGNS: ['super_admin', 'business_admin', 'manager', 'supervisor', 'crm_manager'],
  MANAGE_CAMPAIGNS: ['super_admin', 'business_admin', 'manager'],
  VIEW_TEAMS: ['super_admin', 'business_admin', 'manager', 'supervisor'],
  MANAGE_TEAMS: ['super_admin', 'business_admin', 'manager'],
  VIEW_QA: ['super_admin', 'business_admin', 'manager', 'supervisor', 'qa_officer'],
  VIEW_REPORTS: ['super_admin', 'business_admin', 'manager', 'supervisor', 'reporting_analyst'],
  EXPORT_REPORTS: ['super_admin', 'business_admin', 'reporting_analyst'],
  VIEW_AUDIT_LOGS: ['super_admin', 'auditor', 'business_admin'],
  MANAGE_INTEGRATIONS: ['super_admin', 'integration_admin', 'business_admin'],
  MANAGE_SETTINGS: ['super_admin', 'business_admin', 'integration_admin'],
  MANAGE_ORGANIZATIONS: ['super_admin'],
};

export function hasPermission(userRole, requiredRoles) {
  if (!userRole) return false;
  if (userRole === ROLES.SUPER_ADMIN) return true;
  if (!requiredRoles) return false;
  return requiredRoles.includes(userRole);
}
