import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { LoginPage } from '../features/auth/LoginPage';
import {
  ForgotPasswordPage,
  ResetPasswordPage,
  UnauthorizedPage,
  AuthCallbackPage,
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
import { useAuth } from './providers';

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export const router = createBrowserRouter([
  // Public Auth Routes
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

  // Dedicated Direct Role Dashboards (Section 2) wrapped in AppShell & ProtectedRoute
  {
    path: '/super-admin/dashboard',
    element: (
      <ProtectedRoute>
        <AppShell>
          <SuperAdminDashboard />
        </AppShell>
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/dashboard',
    element: (
      <ProtectedRoute>
        <AppShell>
          <BusinessAdminDashboard />
        </AppShell>
      </ProtectedRoute>
    ),
  },
  {
    path: '/manager/dashboard',
    element: (
      <ProtectedRoute>
        <AppShell>
          <CallCenterManagerDashboard />
        </AppShell>
      </ProtectedRoute>
    ),
  },
  {
    path: '/supervisor/dashboard',
    element: (
      <ProtectedRoute>
        <AppShell>
          <SupervisorDashboard />
        </AppShell>
      </ProtectedRoute>
    ),
  },
  {
    path: '/agent/dashboard',
    element: (
      <ProtectedRoute>
        <AppShell>
          <AgentDashboard />
        </AppShell>
      </ProtectedRoute>
    ),
  },
  {
    path: '/crm/dashboard',
    element: (
      <ProtectedRoute>
        <AppShell>
          <CrmManagerDashboard />
        </AppShell>
      </ProtectedRoute>
    ),
  },
  {
    path: '/qa/dashboard',
    element: (
      <ProtectedRoute>
        <AppShell>
          <QaOfficerDashboard />
        </AppShell>
      </ProtectedRoute>
    ),
  },
  {
    path: '/reports/dashboard',
    element: (
      <ProtectedRoute>
        <AppShell>
          <ReportingAnalystDashboard />
        </AppShell>
      </ProtectedRoute>
    ),
  },
  {
    path: '/auditor/dashboard',
    element: (
      <ProtectedRoute>
        <AppShell>
          <AuditorDashboard />
        </AppShell>
      </ProtectedRoute>
    ),
  },
  {
    path: '/integrations/dashboard',
    element: (
      <ProtectedRoute>
        <AppShell>
          <IntegrationAdminDashboard />
        </AppShell>
      </ProtectedRoute>
    ),
  },

  // Protected Application Routes wrapped in AppShell
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
      // Section 4 Dedicated Permissions Management Screen
      {
        path: 'roles-permissions',
        element: <RolesPermissionsPage />,
      },
      // User Management & Password Handover Screen
      {
        path: 'users',
        element: <UserManagementPage />,
      },
      {
        path: 'users/create',
        element: <UserManagementPage />,
      },
      {
        path: 'leads',
        element: <LeadsPage />,
      },
      {
        path: 'leads/new',
        element: <NewLeadPage />,
      },
      {
        path: 'leads/:id',
        element: <LeadDetailPage />,
      },
      {
        path: 'customers',
        element: <LeadsPage />,
      },
      {
        path: 'dialer',
        element: <DialerPage />,
      },
      {
        path: 'calls',
        element: <CallsPage />,
      },
      {
        path: 'campaigns',
        element: <CampaignsPage />,
      },
      {
        path: 'follow-ups',
        element: <FollowUpsPage />,
      },
      {
        path: 'qa',
        element: <QAPage />,
      },
      {
        path: 'reports',
        element: <ReportsPage />,
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
        path: 'roles',
        element: <RolesPermissionsPage />,
      },
      {
        path: 'organization',
        element: <SettingsPage />,
      },
      {
        path: 'audit-logs',
        element: <AuditorDashboard />,
      },
      {
        path: 'notifications',
        element: <FollowUpsPage />,
      },
      {
        path: 'integrations',
        element: <IntegrationAdminDashboard />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
    ],
  },

  // Root redirect
  {
    path: '/',
    element: <Navigate to="/app/dashboard" replace />,
  },
  // Fallback
  {
    path: '*',
    element: <Navigate to="/app/dashboard" replace />,
  },
]);
