import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { ToastProvider } from '../components/ui/Toast';
import { ROLE_LABELS, ROLE_DASHBOARD_ROUTES } from '../lib/permissions';

const AuthContext = createContext(null);

/** Fetch the user's profile + roles + permissions from the backend /api/auth/me */
async function fetchUserProfile(accessToken) {
  try {
    const apiBase = import.meta.env.VITE_API_URL || '';
    const res = await fetch(`${apiBase}/api/auth/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data?.user || null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('lander_demo_user');
    if (saved) {
      try { return JSON.parse(saved); } catch { return null; }
    }
    // Default super-admin for first visit (demo mode)
    return {
      id: 'usr_superadmin_01',
      name: 'Sarah Miller',
      email: 'sarah.miller@landercrm.io',
      role: 'super_admin',
      roles: ['super_admin'],
      roleTitle: 'Super Admin',
      organization: 'Lander Global Enterprises',
      organization_id: '00000000-0000-0000-0000-000000000001',
      permissions: [],
      accessToken: 'demo-superadmin-token',
    };
  });
  const [loading, setLoading] = useState(false);

  /** Build a normalized user object from Supabase session + backend profile */
  const buildUserFromSession = useCallback(async (session) => {
    if (!session?.user) return null;
    const accessToken = session.access_token;

    // Try backend /api/auth/me for roles & permissions
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
      accessToken,
    };
  }, []);

  // Listen to Supabase auth state changes (real auth)
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const u = await buildUserFromSession(session);
        if (u) {
          setUser(u);
          localStorage.setItem('lander_demo_user', JSON.stringify(u));
        }
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const u = await buildUserFromSession(session);
        if (u) {
          setUser(u);
          localStorage.setItem('lander_demo_user', JSON.stringify(u));
        }
      } else if (_event === 'SIGNED_OUT') {
        setUser(null);
        localStorage.removeItem('lander_demo_user');
      }
    });

    return () => subscription?.unsubscribe();
  }, [buildUserFromSession]);

  /**
   * login(email, password)
   * First tries the backend API, then falls back to Supabase direct, then demo mode.
   */
  const login = async (email, password) => {
    setLoading(true);
    try {
      const apiBase = import.meta.env.VITE_API_URL || '';

      // 1. Try backend API login (gets role-aware redirect)
      try {
        const res = await fetch(`${apiBase}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        if (res.ok) {
          const json = await res.json();
          const { user: userPayload, token, redirectTo } = json.data;
          const normalizedUser = {
            id: userPayload.id,
            email: userPayload.email,
            name: userPayload.full_name || email.split('@')[0],
            role: userPayload.roles?.[0] || 'agent',
            roles: userPayload.roles || ['agent'],
            roleTitle: ROLE_LABELS[userPayload.roles?.[0]] || 'User',
            organization: userPayload.organization_id,
            organization_id: userPayload.organization_id,
            permissions: userPayload.permissions || [],
            accessToken: token,
          };
          setUser(normalizedUser);
          localStorage.setItem('lander_demo_user', JSON.stringify(normalizedUser));
          return { success: true, redirectTo: redirectTo || ROLE_DASHBOARD_ROUTES[normalizedUser.role] || '/app/dashboard' };
        }
      } catch {
        // Backend not reachable – fall through
      }

      // 2. Try Supabase direct auth
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (!error && data?.session) {
        const u = await buildUserFromSession(data.session);
        if (u) {
          setUser(u);
          localStorage.setItem('lander_demo_user', JSON.stringify(u));
          return { success: true, redirectTo: ROLE_DASHBOARD_ROUTES[u.role] || '/app/dashboard' };
        }
      }

      // 3. Demo fallback: derive role from email keywords
      const lowerEmail = email.toLowerCase();
      const demoRole =
        lowerEmail.includes('super') || lowerEmail.includes('platform') ? 'super_admin'
        : lowerEmail.includes('admin') || lowerEmail.includes('business') ? 'business_admin'
        : lowerEmail.includes('manager') ? 'manager'
        : lowerEmail.includes('supervisor') ? 'supervisor'
        : lowerEmail.includes('crm') ? 'crm_manager'
        : lowerEmail.includes('qa') ? 'qa_officer'
        : lowerEmail.includes('report') ? 'reporting_analyst'
        : lowerEmail.includes('audit') ? 'auditor'
        : lowerEmail.includes('integration') ? 'integration_admin'
        : 'agent';

      const demoUser = {
        id: `usr_demo_${Date.now()}`,
        name: email.split('@')[0].replace(/[._]/g, ' '),
        email,
        role: demoRole,
        roles: [demoRole],
        roleTitle: ROLE_LABELS[demoRole] || 'User',
        organization: 'Lander Call Center CRM',
        organization_id: '00000000-0000-0000-0000-000000000001',
        permissions: [],
        accessToken: `demo-${demoRole}-token`,
      };
      setUser(demoUser);
      localStorage.setItem('lander_demo_user', JSON.stringify(demoUser));
      return { success: true, redirectTo: ROLE_DASHBOARD_ROUTES[demoRole] || '/app/dashboard' };
    } finally {
      setLoading(false);
    }
  };

  /**
   * loginDemo(role) – Switch to any role instantly for demonstration.
   * Backend verifies every role; this is UI-only demo switching.
   */
  const loginDemo = (role = 'super_admin') => {
    const DEMO_NAMES = {
      super_admin: 'Sarah Miller',
      business_admin: 'Arthur Pendelton',
      manager: 'Marcus Vance',
      supervisor: 'Elena Rostova',
      agent: 'Emily Chen',
      crm_manager: 'Devon Miles',
      qa_officer: 'David Ross',
      reporting_analyst: 'Chloe Bennett',
      auditor: 'Frank Miller',
      integration_admin: 'Alex Rivera',
    };

    const demoUser = {
      id: `usr_demo_${role}`,
      name: DEMO_NAMES[role] || 'Demo User',
      email: `${role.replace(/_/g, '.')}@landercrm.io`,
      role,
      roles: [role],
      roleTitle: ROLE_LABELS[role] || role,
      organization: role === 'super_admin' ? 'Lander Global Enterprises' : 'Example Call Center',
      organization_id: role === 'super_admin'
        ? '00000000-0000-0000-0000-000000000000'
        : '00000000-0000-0000-0000-000000000001',
      permissions: [],
      accessToken: `demo-${role}-token`,
    };
    setUser(demoUser);
    localStorage.setItem('lander_demo_user', JSON.stringify(demoUser));
    return ROLE_DASHBOARD_ROUTES[role] || '/app/dashboard';
  };

  /**
   * switchRole(newRole) – For multi-role users to switch active role context.
   * Backend still enforces permissions per role.
   */
  const switchRole = (newRole) => {
    if (!user) return;
    const updated = {
      ...user,
      role: newRole,
      roleTitle: ROLE_LABELS[newRole] || newRole,
    };
    setUser(updated);
    localStorage.setItem('lander_demo_user', JSON.stringify(updated));
    return ROLE_DASHBOARD_ROUTES[newRole] || '/app/dashboard';
  };

  const logout = async () => {
    setLoading(true);
    try {
      // Try backend logout
      if (user?.accessToken) {
        const apiBase = import.meta.env.VITE_API_URL || '';
        fetch(`${apiBase}/api/auth/logout`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${user.accessToken}` },
        }).catch(() => {});
      }
      await supabase.auth.signOut().catch(() => {});
    } finally {
      localStorage.removeItem('lander_demo_user');
      setUser(null);
      setLoading(false);
    }
  };

  /** hasPermission(permKey) – Check if current user has a specific permission */
  const hasPermission = (permKey) => {
    if (!user) return false;
    if (user.role === 'super_admin') return true;
    return user.permissions?.includes(permKey) || false;
  };

  /** hasRole(...roles) – Check if user has one of the given roles */
  const hasRole = (...roles) => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      loginDemo,
      switchRole,
      logout,
      hasPermission,
      hasRole,
    }}>
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
