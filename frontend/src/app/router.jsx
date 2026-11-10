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

function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (allowedRoles && !allowedRoles.includes(user.role) && user.role !== 'super_admin') {
    return <Navigate to="/unauthorized" replace />;
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

  // Dedicated Direct Role Dashboards (Section 2) with Strict RBAC verification
  {
    path: '/super-admin/dashboard',
    element: (
      <ProtectedRoute allowedRoles={['super_admin']}>
        <AppShell>
          <SuperAdminDashboard />
        </AppShell>
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/dashboard',
    element: (
      <ProtectedRoute allowedRoles={['business_admin', 'super_admin']}>
        <AppShell>
          <BusinessAdminDashboard />
        </AppShell>
      </ProtectedRoute>
    ),
  },
  {
    path: '/manager/dashboard',
    element: (
      <ProtectedRoute allowedRoles={['manager', 'business_admin', 'super_admin']}>
        <AppShell>
          <CallCenterManagerDashboard />
        </AppShell>
      </ProtectedRoute>
    ),
  },
  {
    path: '/supervisor/dashboard',
    element: (
      <ProtectedRoute allowedRoles={['supervisor', 'manager', 'business_admin', 'super_admin']}>
        <AppShell>
          <SupervisorDashboard />
        </AppShell>
      </ProtectedRoute>
    ),
  },
  {
    path: '/agent/dashboard',
    element: (
      <ProtectedRoute allowedRoles={['agent', 'supervisor', 'manager', 'business_admin', 'super_admin']}>
        <AppShell>
          <AgentDashboard />
        </AppShell>
      </ProtectedRoute>
    ),
  },
  {
    path: '/crm/dashboard',
    element: (
      <ProtectedRoute allowedRoles={['crm_manager', 'business_admin', 'super_admin']}>
        <AppShell>
          <CrmManagerDashboard />
        </AppShell>
      </ProtectedRoute>
    ),
  },
  {
    path: '/qa/dashboard',
    element: (
      <ProtectedRoute allowedRoles={['qa_officer', 'business_admin', 'super_admin']}>
        <AppShell>
          <QaOfficerDashboard />
        </AppShell>
      </ProtectedRoute>
    ),
  },
  {
    path: '/reports/dashboard',
    element: (
      <ProtectedRoute allowedRoles={['reporting_analyst', 'manager', 'business_admin', 'super_admin']}>
        <AppShell>
          <ReportingAnalystDashboard />
        </AppShell>
      </ProtectedRoute>
    ),
  },
  {
    path: '/auditor/dashboard',
    element: (
      <ProtectedRoute allowedRoles={['auditor', 'super_admin']}>
        <AppShell>
          <AuditorDashboard />
        </AppShell>
      </ProtectedRoute>
    ),
  },
  {
    path: '/integrations/dashboard',
    element: (
      <ProtectedRoute allowedRoles={['integration_admin', 'business_admin', 'super_admin']}>
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
