/**
 * accounts.js - Authorized Individual Accounts Registry
 *
 * Implements strict individual account authentication (FR-17, FR-18, FR-19, FR-20).
 * Every role requires its own separate login credentials.
 */

import { ROLE_LABELS, ROLE_DASHBOARD_ROUTES } from './permissions';

export const INDIVIDUAL_ACCOUNTS = {
  'sarah.miller@landercrm.io': {
    id: 'usr_superadmin_01',
    password: 'SuperAdmin@2026!',
    fullName: 'Sarah Miller',
    role: 'super_admin',
    roles: ['super_admin'],
    organization: 'Lander Global Enterprises',
    organizationId: '00000000-0000-0000-0000-000000000000',
    status: 'active',
    dashboardRoute: '/super-admin/dashboard',
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
    id: 'usr_businessadmin_01',
    password: 'BusinessAdmin@2026!',
    fullName: 'Arthur Pendelton',
    role: 'business_admin',
    roles: ['business_admin'],
    organization: 'Example Call Center',
    organizationId: '00000000-0000-0000-0000-000000000001',
    status: 'active',
    dashboardRoute: '/admin/dashboard',
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
    id: 'usr_manager_01',
    password: 'ManagerPass@2026!',
    fullName: 'Marcus Vance',
    role: 'manager',
    roles: ['manager'],
    organization: 'Example Call Center',
    organizationId: '00000000-0000-0000-0000-000000000001',
    status: 'active',
    dashboardRoute: '/manager/dashboard',
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
    id: 'usr_supervisor_01',
    password: 'SupervisorPass@2026!',
    fullName: 'Elena Rostova',
    role: 'supervisor',
    roles: ['supervisor'],
    organization: 'Example Call Center',
    organizationId: '00000000-0000-0000-0000-000000000001',
    status: 'active',
    dashboardRoute: '/supervisor/dashboard',
    permissions: [
      'supervisor.dashboard.read',
      'users.read',
      'leads.read', 'leads.assign',
      'calls.initiate', 'calls.read', 'calls.update', 'calls.recording.read',
      'follow_ups.manage', 'reports.view', 'qa_reviews.read',
    ],
  },
  'emily.chen@callcenter.com': {
    id: 'usr_agent_01',
    password: 'AgentPass@2026!',
    fullName: 'Emily Chen',
    role: 'agent',
    roles: ['agent'],
    organization: 'Example Call Center',
    organizationId: '00000000-0000-0000-0000-000000000001',
    status: 'active',
    dashboardRoute: '/agent/dashboard',
    permissions: [
      'agent.dashboard.read',
      'leads.read', 'leads.update',
      'calls.initiate', 'calls.read', 'calls.update',
      'follow_ups.manage',
    ],
  },
  'devon.m@callcenter.com': {
    id: 'usr_crm_01',
    password: 'CrmManager@2026!',
    fullName: 'Devon Miles',
    role: 'crm_manager',
    roles: ['crm_manager'],
    organization: 'Example Call Center',
    organizationId: '00000000-0000-0000-0000-000000000001',
    status: 'active',
    dashboardRoute: '/crm/dashboard',
    permissions: [
      'crm.dashboard.read',
      'leads.create', 'leads.read', 'leads.update', 'leads.assign', 'leads.import', 'leads.export', 'leads.archive',
    ],
  },
  'david.ross@callcenter.com': {
    id: 'usr_qa_01',
    password: 'QaOfficer@2026!',
    fullName: 'David Ross',
    role: 'qa_officer',
    roles: ['qa_officer'],
    organization: 'Example Call Center',
    organizationId: '00000000-0000-0000-0000-000000000001',
    status: 'active',
    dashboardRoute: '/qa/dashboard',
    permissions: [
      'qa.dashboard.read',
      'calls.read', 'calls.recording.read',
      'qa_reviews.create', 'qa_reviews.read',
    ],
  },
  'chloe.b@callcenter.com': {
    id: 'usr_analyst_01',
    password: 'AnalystPass@2026!',
    fullName: 'Chloe Bennett',
    role: 'reporting_analyst',
    roles: ['reporting_analyst'],
    organization: 'Example Call Center',
    organizationId: '00000000-0000-0000-0000-000000000001',
    status: 'active',
    dashboardRoute: '/reports/dashboard',
    permissions: [
      'reports.dashboard.read',
      'reports.view', 'reports.export',
    ],
  },
  'frank.audit@callcenter.com': {
    id: 'usr_auditor_01',
    password: 'AuditorPass@2026!',
    fullName: 'Frank Miller',
    role: 'auditor',
    roles: ['auditor'],
    organization: 'Example Call Center',
    organizationId: '00000000-0000-0000-0000-000000000001',
    status: 'active',
    dashboardRoute: '/auditor/dashboard',
    permissions: [
      'auditor.dashboard.read',
      'audit_logs.read',
    ],
  },
  'alex.telecom@callcenter.com': {
    id: 'usr_integration_01',
    password: 'IntegrationAdmin@2026!',
    fullName: 'Alex Rivera',
    role: 'integration_admin',
    roles: ['integration_admin'],
    organization: 'Example Call Center',
    organizationId: '00000000-0000-0000-0000-000000000001',
    status: 'active',
    dashboardRoute: '/integrations/dashboard',
    permissions: [
      'integrations.dashboard.read',
      'integrations.manage', 'settings.manage',
    ],
  },
};

/**
 * verifyCredentials(email, password)
 * Strictly verifies individual email and password against the authorized registry.
 */
export function verifyCredentials(email, password) {
  if (!email || !password) {
    return { success: false, error: 'Email and password are required.' };
  }

  const normalized = email.trim().toLowerCase();
  const account = INDIVIDUAL_ACCOUNTS[normalized];

  if (!account) {
    return {
      success: false,
      error: 'Access Denied: Account not found. Each role requires individual credentials.',
    };
  }

  if (account.password !== password) {
    return {
      success: false,
      error: 'Access Denied: Invalid email or password. Access denied.',
    };
  }

  if (account.status !== 'active') {
    return {
      success: false,
      error: 'Access Denied: Account has been deactivated. Please contact your administrator.',
    };
  }

  return {
    success: true,
    user: {
      id: account.id,
      email: normalized,
      name: account.fullName,
      role: account.role,
      roles: account.roles,
      roleTitle: ROLE_LABELS[account.role] || account.role,
      organization: account.organization,
      organization_id: account.organizationId,
      permissions: account.permissions,
      status: account.status,
      accessToken: `lander_jwt_${account.role}_${Date.now()}`,
    },
    redirectTo: account.dashboardRoute || ROLE_DASHBOARD_ROUTES[account.role] || '/app/dashboard',
  };
}

