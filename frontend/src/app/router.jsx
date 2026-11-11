import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import { AppShell } from '../components/layout/AppShell';
import { LoginPage } from '../features/auth/LoginPage';
import {
  ForgotPasswordPage,
  ResetPasswordPage,
  UnauthorizedPage,
  AuthCallbackPage,
  AcceptInvitePage,
} from '../features/auth/AuthPages';
import { DashboardPage } from '../features/dashboard/DashboardPage';
import { LeadsPage } from '../features/leads/LeadsPage';
import { LeadDetailPage } from '../features/leads/LeadDetailPage';
import { NewLeadPage } from '../features/leads/NewLeadPage';
import { DialerPage } from '../features/dialer/DialerPage';
import { CallsPage } from '../features/calls/CallsPage';
import { CampaignsPage, FollowUpsPage } from '../features/campaigns/CampaignPages';
import { QAPage, ReportsPage, SettingsPage } from '../features/settings/OperationalPages';
import { RolesPermissionsPage } from '../features/settings/RolesPermissionsPage';
import { UserManagementPage } from '../features/settings/UserManagementPage';
import { OrganizationsPage } from '../features/admin/OrganizationsPage';
import { InvitationsPage } from '../features/admin/InvitationsPage';
import {
  SuperAdminDashboard,
  BusinessAdminDashboard,
  CallCenterManagerDashboard,
  SupervisorDashboard,
  AgentDashboard,
  CrmManagerDashboard,
  QaOfficerDashboard,
  ReportingAnalystDashboard,
  AuditorDashboard,
  IntegrationAdminDashboard,
} from '../features/dashboard/RoleDashboards';

export const router = createBrowserRouter([
  // ── Public Auth Routes ────────────────────────────────────────────────────────
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPasswordPage />,
  },
  {
    path: '/reset-password',
    element: <ResetPasswordPage />,
  },
  {
    path: '/unauthorized',
    element: <UnauthorizedPage />,
  },
  {
    path: '/auth/callback',
    element: <AuthCallbackPage />,
  },
  {
    path: '/accept-invite',
    element: <AcceptInvitePage />,
  },

  // ── Strict Protected Role-Specific Dashboards (Section 2 & 4) ─────────────────
  // FR-18: Universal Dashboard Protection — Reject unauthenticated requests
  // FR-19: Strict Role Authorization — Permission & Role verification
  {
    path: '/super-admin/dashboard',
    element: (
      <ProtectedRoute
        allowedRoles={['super_admin']}
        requiredPermission="platform.dashboard.read"
      >
        <AppShell>
          <SuperAdminDashboard />
        </AppShell>
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/dashboard',
    element: (
      <ProtectedRoute
        allowedRoles={['business_admin', 'super_admin']}
        requiredPermission="organization.dashboard.read"
      >
        <AppShell>
          <BusinessAdminDashboard />
        </AppShell>
      </ProtectedRoute>
    ),
  },
  {
    path: '/manager/dashboard',
    element: (
      <ProtectedRoute
        allowedRoles={['manager', 'business_admin', 'super_admin']}
        requiredPermission="manager.dashboard.read"
      >
        <AppShell>
          <CallCenterManagerDashboard />
        </AppShell>
      </ProtectedRoute>
    ),
  },
  {
    path: '/supervisor/dashboard',
    element: (
      <ProtectedRoute
        allowedRoles={['supervisor', 'manager', 'business_admin', 'super_admin']}
        requiredPermission="supervisor.dashboard.read"
      >
        <AppShell>
          <SupervisorDashboard />
        </AppShell>
      </ProtectedRoute>
    ),
  },
  {
    path: '/agent/dashboard',
    element: (
      <ProtectedRoute
        allowedRoles={['agent', 'supervisor', 'manager', 'business_admin', 'super_admin']}
        requiredPermission="agent.dashboard.read"
      >
        <AppShell>
          <AgentDashboard />
        </AppShell>
      </ProtectedRoute>
    ),
  },
  {
    path: '/crm/dashboard',
    element: (
      <ProtectedRoute
        allowedRoles={['crm_manager', 'business_admin', 'super_admin']}
        requiredPermission="crm.dashboard.read"
      >
        <AppShell>
          <CrmManagerDashboard />
        </AppShell>
      </ProtectedRoute>
    ),
  },
  {
    path: '/qa/dashboard',
    element: (
      <ProtectedRoute
        allowedRoles={['qa_officer', 'business_admin', 'super_admin']}
        requiredPermission="qa.dashboard.read"
      >
        <AppShell>
          <QaOfficerDashboard />
        </AppShell>
      </ProtectedRoute>
    ),
  },
  {
    path: '/reports/dashboard',
    element: (
      <ProtectedRoute
        allowedRoles={['reporting_analyst', 'manager', 'business_admin', 'super_admin']}
        requiredPermission="reports.dashboard.read"
      >
        <AppShell>
          <ReportingAnalystDashboard />
        </AppShell>
      </ProtectedRoute>
    ),
  },
  {
    path: '/auditor/dashboard',
    element: (
      <ProtectedRoute
        allowedRoles={['auditor', 'super_admin']}
        requiredPermission="auditor.dashboard.read"
      >
        <AppShell>
          <AuditorDashboard />
        </AppShell>
      </ProtectedRoute>
    ),
  },
  {
    path: '/integrations/dashboard',
    element: (
      <ProtectedRoute
        allowedRoles={['integration_admin', 'business_admin', 'super_admin']}
        requiredPermission="integrations.dashboard.read"
      >
        <AppShell>
          <IntegrationAdminDashboard />
        </AppShell>
      </ProtectedRoute>
    ),
  },

  // ── Protected Application Workspace (/app/*) ──────────────────────────────────
  {
    path: '/app',
    element: (
      <ProtectedRoute>
        <AppShell />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/app/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      // Super Admin: Platform Organizations
      {
        path: 'organizations',
        element: (
          <ProtectedRoute allowedRoles={['super_admin']} requiredPermission="organizations.manage">
            <OrganizationsPage />
          </ProtectedRoute>
        ),
      },
      // Business Admin / Super Admin: User Provisioning
      {
        path: 'users',
        element: (
          <ProtectedRoute allowedRoles={['super_admin', 'business_admin']} requiredPermission="users.read">
            <UserManagementPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'users/create',
        element: (
          <ProtectedRoute allowedRoles={['super_admin', 'business_admin']} requiredPermission="users.create">
            <UserManagementPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'invitations',
        element: (
          <ProtectedRoute allowedRoles={['super_admin', 'business_admin']} requiredPermission="users.create">
            <InvitationsPage />
          </ProtectedRoute>
        ),
      },
      // Section 4: Dedicated Permissions Management Screen
      {
        path: 'roles-permissions',
        element: (
          <ProtectedRoute allowedRoles={['super_admin', 'business_admin']}>
            <RolesPermissionsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'roles',
        element: (
          <ProtectedRoute allowedRoles={['super_admin', 'business_admin']}>
            <RolesPermissionsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'leads',
        element: (
          <ProtectedRoute requiredPermission="leads.read">
            <LeadsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'leads/new',
        element: (
          <ProtectedRoute requiredPermission="leads.create">
            <NewLeadPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'leads/:id',
        element: (
          <ProtectedRoute requiredPermission="leads.read">
            <LeadDetailPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'customers',
        element: (
          <ProtectedRoute requiredPermission="leads.read">
            <LeadsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'dialer',
        element: (
          <ProtectedRoute allowedRoles={['agent', 'supervisor', 'manager', 'business_admin', 'super_admin']} requiredPermission="calls.initiate">
            <DialerPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'calls',
        element: (
          <ProtectedRoute requiredPermission="calls.read">
            <CallsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'campaigns',
        element: (
          <ProtectedRoute allowedRoles={['super_admin', 'business_admin', 'manager', 'supervisor', 'crm_manager']}>
            <CampaignsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'follow-ups',
        element: (
          <ProtectedRoute requiredPermission="leads.read">
            <FollowUpsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'qa',
        element: (
          <ProtectedRoute allowedRoles={['qa_officer', 'business_admin', 'manager', 'supervisor', 'super_admin']}>
            <QAPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'reports',
        element: (
          <ProtectedRoute allowedRoles={['reporting_analyst', 'manager', 'business_admin', 'super_admin']} requiredPermission="reports.view">
            <ReportsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'audit-logs',
        element: (
          <ProtectedRoute allowedRoles={['auditor', 'super_admin', 'business_admin']} requiredPermission="audit_logs.read">
            <AuditorDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: 'integrations',
        element: (
          <ProtectedRoute allowedRoles={['integration_admin', 'super_admin', 'business_admin']}>
            <IntegrationAdminDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: 'settings',
        element: (
          <ProtectedRoute allowedRoles={['super_admin', 'business_admin', 'integration_admin']}>
            <SettingsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'notifications',
        element: <FollowUpsPage />,
      },
      {
        path: 'agents',
        element: <LeadsPage />,
      },
      {
        path: 'teams',
        element: <LeadsPage />,
      },
      {
        path: 'organization',
        element: <SettingsPage />,
      },
    ],
  },

  // ── Root & Fallback Redirects ─────────────────────────────────────────────────
  // Unauthenticated users are redirected to /login by ProtectedRoute
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Navigate to="/app/dashboard" replace />
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: (
      <ProtectedRoute>
        <Navigate to="/app/dashboard" replace />
      </ProtectedRoute>
    ),
  },
]);
