import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../features/auth/useAuth';

/**
 * ProtectedRoute Component
 *
 * Implements strict authentication and dashboard protection:
 * - FR-17: Individual Account Authentication
 * - FR-18: Universal Dashboard Protection (rejects unauthenticated requests, redirects to /login)
 * - FR-19: Strict Role Authorization (rejects unauthorized access, redirects to /unauthorized)
 * - FR-20: Session and Account Security (expired, revoked or deactivated accounts denied access)
 */
export default function ProtectedRoute({ requiredPermission, allowedRoles, children }) {
  const location = useLocation();
  const { user, loading, hasPermission } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-page">
        <div className="text-center space-y-3">
          <div className="mx-auto h-9 w-9 rounded-full border-3 border-brand border-t-transparent animate-spin" />
          <p className="text-sm font-semibold text-slate-600">
            Verifying your account...
          </p>
        </div>
      </div>
    );
  }

  // FR-18: Must authenticate first before accessing any dashboard or protected resource
  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  // FR-20: Deactivated accounts lose access immediately
  if (user.status && user.status !== 'active') {
    return (
      <Navigate
        to="/unauthorized"
        replace
        state={{ reason: 'deactivated', from: location.pathname }}
      />
    );
  }

  // FR-19: Strict Role Check
  if (allowedRoles && allowedRoles.length > 0) {
    const hasRole = allowedRoles.includes(user.role) || user.role === 'super_admin';
    if (!hasRole) {
      return (
        <Navigate
          to="/unauthorized"
          replace
          state={{ reason: 'role_denied', requiredRoles: allowedRoles, from: location.pathname }}
        />
      );
    }
  }

  // FR-19: Strict Granular Permission Check
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <Navigate
        to="/unauthorized"
        replace
        state={{ reason: 'permission_denied', requiredPermission, from: location.pathname }}
      />
    );
  }

  return children ? children : <Outlet />;
}

export { ProtectedRoute };
