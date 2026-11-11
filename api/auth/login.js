/**
 * api/auth/login.js
 * Vercel Serverless Function for POST /api/auth/login
 * Strict individual credential validation and token generation.
 */

const INDIVIDUAL_ACCOUNTS = {
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
      'calls.read', 'campaigns.manage', 'follow_ups.manage',
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
      'calls.read', 'calls.recording.read',
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

export default function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, apikey, prefer'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        body = {};
      }
    }

    const { email, password } = body || {};

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const account = INDIVIDUAL_ACCOUNTS[normalizedEmail];

    if (!account) {
      return res.status(401).json({
        success: false,
        error: 'Access Denied: Account not found. Each role requires individual credentials.',
      });
    }

    if (account.password !== password) {
      return res.status(401).json({
        success: false,
        error: 'Access Denied: Invalid email or password. Access denied.',
      });
    }

    if (account.status !== 'active') {
      return res.status(403).json({
        success: false,
        error: 'Access Denied: Account has been deactivated. Please contact your administrator.',
      });
    }

    const token = `lander_jwt_${account.role}_${Date.now()}`;
    const userPayload = {
      id: account.id,
      email: normalizedEmail,
      full_name: account.fullName,
      roles: account.roles,
      organization_id: account.organizationId,
      status: account.status,
      permissions: account.permissions,
    };

    return res.status(200).json({
      success: true,
      data: {
        token,
        user: userPayload,
        redirectTo: account.dashboardRoute,
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Internal authentication server error',
    });
  }
}
