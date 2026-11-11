/**
 * api.js — LANDER CRM API Client
 * 
 * Provides a typed, authenticated fetch wrapper with:
 * - Bearer token injection from localStorage (or user context)
 * - Graceful fallback when backend is not reachable (demo mode)
 * - Specific API helpers for RBAC operations
 */

const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api';

/** Retrieve the current access token from localStorage */
function getToken() {
  try {
    const saved = localStorage.getItem('lander_demo_user');
    if (saved) {
      const user = JSON.parse(saved);
      return user.accessToken || null;
    }
  } catch {}
  return null;
}

/**
 * Core API request function.
 * @param {string} endpoint  - e.g. '/auth/me'
 * @param {RequestInit} options - fetch options
 * @returns {Promise<any>} - parsed JSON data or null on failure
 */
export async function apiRequest(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    if (res.status === 401) {
      // Token expired — clear local state
      localStorage.removeItem('lander_demo_user');
      window.location.href = '/login';
      return null;
    }

    const json = await res.json();
    if (!res.ok) {
      console.warn(`API ${options.method || 'GET'} ${endpoint} → ${res.status}:`, json?.error);
      return { error: json?.error || `HTTP ${res.status}`, status: res.status };
    }

    return json?.data ?? json;
  } catch (err) {
    console.warn(`Request to ${endpoint} failed (demo mode):`, err.message);
    return null;
  }
}

// ── Convenience helpers ────────────────────────────────────────────────────────

export const api = {
  // ── Auth ───────────────────────────────────────────────────────────────────
  auth: {
    login: (email, password) =>
      apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),

    logout: () =>
      apiRequest('/auth/logout', { method: 'POST' }),

    me: () =>
      apiRequest('/auth/me'),

    forgotPassword: (email) =>
      apiRequest('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      }),

    invite: (email, roleName, fullName) =>
      apiRequest('/auth/invite', {
        method: 'POST',
        body: JSON.stringify({ email, role_name: roleName, full_name: fullName }),
      }),

    acceptInvite: (token, password, fullName) =>
      apiRequest('/auth/accept-invite', {
        method: 'POST',
        body: JSON.stringify({ token, password, full_name: fullName }),
      }),
  },

  // ── Organizations ──────────────────────────────────────────────────────────
  organizations: {
    list: () =>
      apiRequest('/organizations'),

    get: (id) =>
      apiRequest(`/organizations/${id}`),

    create: (data) =>
      apiRequest('/organizations', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    update: (id, data) =>
      apiRequest(`/organizations/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
  },

  // ── Users ──────────────────────────────────────────────────────────────────
  users: {
    list: (params = {}) => {
      const qs = new URLSearchParams(params).toString();
      return apiRequest(`/users${qs ? '?' + qs : ''}`);
    },

    get: (id) =>
      apiRequest(`/users/${id}`),

    me: () =>
      apiRequest('/users/me'),

    create: (data) =>
      apiRequest('/users', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    update: (id, data) =>
      apiRequest(`/users/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),

    assignRole: (userId, roleName) =>
      apiRequest(`/users/${userId}/roles`, {
        method: 'POST',
        body: JSON.stringify({ role_name: roleName }),
      }),
  },

  // ── Roles & Permissions ───────────────────────────────────────────────────
  roles: {
    list: () =>
      apiRequest('/roles'),

    getPermissions: (roleId) =>
      apiRequest(`/roles/${roleId}/permissions`),

    setPermissions: (roleId, permissionKeys) =>
      apiRequest(`/roles/${roleId}/permissions`, {
        method: 'POST',
        body: JSON.stringify({ permission_keys: permissionKeys }),
      }),

    removePermission: (roleId, permId) =>
      apiRequest(`/roles/${roleId}/permissions/${permId}`, {
        method: 'DELETE',
      }),
  },

  // ── Permissions catalog ────────────────────────────────────────────────────
  permissions: {
    list: () =>
      apiRequest('/roles/permissions'),
  },

  // ── Leads ─────────────────────────────────────────────────────────────────
  leads: {
    list: (params = {}) => {
      const qs = new URLSearchParams(params).toString();
      return apiRequest(`/leads${qs ? '?' + qs : ''}`);
    },
    get: (id) => apiRequest(`/leads/${id}`),
    create: (data) => apiRequest('/leads', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => apiRequest(`/leads/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    assign: (id, agentId) => apiRequest(`/leads/${id}/assign`, { method: 'POST', body: JSON.stringify({ agent_id: agentId }) }),
  },

  // ── Calls ─────────────────────────────────────────────────────────────────
  calls: {
    list: (params = {}) => {
      const qs = new URLSearchParams(params).toString();
      return apiRequest(`/calls${qs ? '?' + qs : ''}`);
    },
    get: (id) => apiRequest(`/calls/${id}`),
    initiate: (data) => apiRequest('/calls', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => apiRequest(`/calls/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  },

  // ── Reports ───────────────────────────────────────────────────────────────
  reports: {
    summary: (params = {}) => {
      const qs = new URLSearchParams(params).toString();
      return apiRequest(`/reports${qs ? '?' + qs : ''}`);
    },
    export: (format = 'csv') => apiRequest(`/reports/export?format=${format}`),
  },
};

export default api;
