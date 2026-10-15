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
        path: 'users',
        element: <SettingsPage />,
      },
      {
        path: 'roles',
        element: <SettingsPage />,
      },
      {
        path: 'organization',
        element: <SettingsPage />,
      },
      {
        path: 'audit-logs',
        element: <CallsPage />,
      },
      {
        path: 'notifications',
        element: <FollowUpsPage />,
      },
      {
        path: 'integrations',
        element: <SettingsPage />,
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
