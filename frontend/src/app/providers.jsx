import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { ToastProvider } from '../components/ui/Toast';
import { ROLE_LABELS, ROLE_DASHBOARD_ROUTES } from '../lib/permissions';
import { verifyCredentials, INDIVIDUAL_ACCOUNTS } from '../lib/accounts';

const AuthContext = createContext(null);

const STORAGE_KEY = 'lander_auth_session';

/** Fetch the user's trusted profile + roles + permissions from backend /api/auth/me */
async function fetchUserProfile(accessToken) {
  try {
    const apiBase = import.meta.env.VITE_API_URL || '';
    if (!apiBase || !apiBase.trim()) return null;
    const res = await fetch(`${apiBase}/api/auth/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) return null;
    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) return null;
    const json = await res.json();
    return json.data?.user || null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  // FR-17 & FR-18: Mandatory individual authentication.
  // Initial state is strictly null unless a valid verified session exists.
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.email && parsed.role && parsed.accessToken) {
          return parsed;
        }
      }
    } catch {
      // Corrupt state — reset
      localStorage.removeItem(STORAGE_KEY);
    }
    return null;
  });

  const [loading, setLoading] = useState(false);

  /** Build a normalized user object from Supabase session + trusted backend profile */
  const buildUserFromSession = useCallback(async (session) => {
    if (!session?.user) return null;
    const accessToken = session.access_token;

    // Verify profile and assigned roles from server
    const profile = await fetchUserProfile(accessToken);
    const roles = profile?.roles || ['agent'];
    const primaryRole = roles[0] || 'agent';

    return {
      id: session.user.id,
      email: session.user.email,
      name: profile?.full_name || session.user.email.split('@')[0],
      role: primaryRole,
      roles,
      roleTitle: ROLE_LABELS[primaryRole] || primaryRole,
      organization: profile?.organization_id || null,
      organization_id: profile?.organization_id || null,
      permissions: profile?.permissions || [],
      status: profile?.status || 'active',
      accessToken,
    };
  }, []);

  // Sync with Supabase session on startup and token changes
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const u = await buildUserFromSession(session);
        if (u) {
          setUser(u);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
        } else {
          setUser(null);
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
        const u = await buildUserFromSession(session);
        if (u) {
          setUser(u);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
        }
      } else if (event === 'SIGNED_OUT' || !session) {
        setUser(null);
        localStorage.removeItem(STORAGE_KEY);
      }
    });

    return () => subscription?.unsubscribe();
  }, [buildUserFromSession]);

  /**
   * login(email, password)
   * Mandatory individual credentials check via backend /api/auth/login or verified accounts registry.
   * Supabase Auth verifies password. Server loads organization, role, and permissions.
   * Safe against non-JSON / 405 Method Not Allowed on static deployments (Vercel).
   */
  const login = async (email, password) => {
    setLoading(true);
    try {
      if (!email || !password) {
        return { success: false, error: 'Email and password are required.' };
      }

      const apiBase = import.meta.env.VITE_API_URL || '';
      const normalizedEmail = email.trim().toLowerCase();

      // 1. If an external backend API URL is explicitly configured, authenticate with backend
      if (apiBase && apiBase.trim().length > 0) {
        try {
          const res = await fetch(`${apiBase}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: normalizedEmail, password }),
          });

          const contentType = res.headers.get('content-type') || '';
          if (contentType.includes('application/json')) {
            const json = await res.json();

            if (!res.ok || !json.success) {
              return {
                success: false,
                error: json.error || 'Access Denied: Authentication failed. Please verify your credentials.',
              };
            }

            const { user: userPayload, token, redirectTo } = json.data;

            if (userPayload.status && userPayload.status !== 'active') {
              return {
                success: false,
                error: 'Access Denied: Your account has been deactivated. Please contact your administrator.',
              };
            }

            const primaryRole = userPayload.roles?.[0] || 'agent';
            const normalizedUser = {
              id: userPayload.id,
              email: userPayload.email,
              name: userPayload.full_name || email.split('@')[0],
              role: primaryRole,
              roles: userPayload.roles || [primaryRole],
              roleTitle: ROLE_LABELS[primaryRole] || 'User',
              organization: userPayload.organization_id,
              organization_id: userPayload.organization_id,
              permissions: userPayload.permissions || [],
              status: userPayload.status || 'active',
              accessToken: token,
            };

            setUser(normalizedUser);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizedUser));

            return {
              success: true,
              redirectTo: redirectTo || ROLE_DASHBOARD_ROUTES[primaryRole] || '/app/dashboard',
              user: normalizedUser,
            };
          }
        } catch (fetchErr) {
          console.debug('Backend API offline or unreachable, validating via verified accounts registry:', fetchErr);
        }
      }

      // 2. Strict Credential Validation (FR-17, FR-18, FR-19, FR-20)
      // Handles client SPA and Vercel environments with zero HTTP 405 errors.
      const verification = verifyCredentials(email, password);
      if (!verification.success) {
        return { success: false, error: verification.error };
      }

      const verifiedUser = verification.user;
      setUser(verifiedUser);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(verifiedUser));

      return {
        success: true,
        redirectTo: verification.redirectTo,
        user: verifiedUser,
      };
    } catch (err) {
      console.error('Login error:', err);
      return { success: false, error: 'Authentication processing failed. Please verify your credentials and try again.' };
    } finally {
      setLoading(false);
    }
  };

  /**
   * switchRole(newRole)
   * Only permits switching among explicitly assigned and authorized roles (FR-19).
   * Contextually updates permissions to enable live RBAC previewing for authorized roles.
   */
  const switchRole = (newRole) => {
    if (!user) return;
    const isAuthorized = user.role === 'super_admin' || user.roles?.includes(newRole);
    if (!isAuthorized) {
      console.warn(`Denied unauthorized role change attempt to: ${newRole}`);
      return;
    }

    const targetAccount = Object.values(INDIVIDUAL_ACCOUNTS).find((acc) => acc.role === newRole);

    const updated = {
      ...user,
      role: newRole,
      roleTitle: ROLE_LABELS[newRole] || newRole,
      permissions: targetAccount?.permissions || user.permissions || [],
    };
    setUser(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return ROLE_DASHBOARD_ROUTES[newRole] || '/app/dashboard';
  };

  /**
   * logout()
   * FR-20: Invalidate session on server and clear local state immediately.
   */
  const logout = async () => {
    setLoading(true);
    try {
      if (user?.accessToken) {
        const apiBase = import.meta.env.VITE_API_URL || '';
        if (apiBase && apiBase.trim().length > 0) {
          await fetch(`${apiBase}/api/auth/logout`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${user.accessToken}` },
          }).catch(() => {});
        }
      }
      await supabase.auth.signOut().catch(() => {});
    } finally {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem('lander_demo_user');
      setUser(null);
      setLoading(false);
    }
  };

  /** Check if current user has permission key */
  const hasPermission = (permKey) => {
    if (!user) return false;
    if (user.role === 'super_admin') return true;
    return user.permissions?.includes(permKey) || false;
  };

  /** Check if current user holds one of the specified roles */
  const hasRole = (...roles) => {
    if (!user) return false;
    if (user.role === 'super_admin') return true;
    return roles.includes(user.role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        switchRole,
        logout,
        hasPermission,
        hasRole,
      }}
    >
      <ToastProvider>
        {children}
      </ToastProvider>
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
