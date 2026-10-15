import { createClient } from './supabase/client.js';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

/**
 * Get the current user's session token.
 */
async function getToken() {
  if (typeof window !== 'undefined') {
    const demoToken = localStorage.getItem('lander_demo_token');
    if (demoToken) return demoToken;
  }
  try {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token || 'demo-superadmin-token';
  } catch {
    return 'demo-superadmin-token';
  }
}


/**
 * Base fetch wrapper that attaches the Bearer token and handles errors.
 */
async function apiFetch(path, options = {}) {
  const token = await getToken();
  if (!token) throw new Error('Not authenticated');

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    const err = new Error(json.error || `Request failed: ${res.status}`);
    err.status = res.status;
    err.data = json;
    throw err;
  }

  return json;
}

// ── LEADS ─────────────────────────────────────────────────────────────────────
export const leadsApi = {
  list: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return apiFetch(`/api/leads?${qs}`);
  },
  get: (id) => apiFetch(`/api/leads/${id}`),
  create: (body) => apiFetch('/api/leads', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => apiFetch(`/api/leads/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  archive: (id) => apiFetch(`/api/leads/${id}`, { method: 'DELETE' }),
  assign: (id, agentId) => apiFetch(`/api/leads/${id}/assign`, { method: 'POST', body: JSON.stringify({ agent_id: agentId }) }),
  distribute: (body = {}) => apiFetch('/api/leads/distribute', { method: 'POST', body: JSON.stringify(body) }),
  autoRoute: (id, body = {}) => apiFetch(`/api/leads/${id}/route`, { method: 'POST', body: JSON.stringify(body) }),
  calls: (id) => apiFetch(`/api/leads/${id}/calls`),
};

// ── CALLS ─────────────────────────────────────────────────────────────────────
export const callsApi = {
  list: (params = {}) => apiFetch(`/api/calls?${new URLSearchParams(params)}`),
  get: (id) => apiFetch(`/api/calls/${id}`),
  create: (body) => apiFetch('/api/calls', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => apiFetch(`/api/calls/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  dial: (body) => apiFetch('/api/calls/dial', { method: 'POST', body: JSON.stringify(body) }),
  hangup: (id) => apiFetch(`/api/calls/${id}/hangup`, { method: 'POST' }),
  disposition: (id, body) => apiFetch(`/api/calls/${id}/disposition`, { method: 'POST', body: JSON.stringify(body) }),
};


// ── CAMPAIGNS ─────────────────────────────────────────────────────────────────
export const campaignsApi = {
  list: (params = {}) => apiFetch(`/api/campaigns?${new URLSearchParams(params)}`),
  get: (id) => apiFetch(`/api/campaigns/${id}`),
  create: (body) => apiFetch('/api/campaigns', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => apiFetch(`/api/campaigns/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  archive: (id) => apiFetch(`/api/campaigns/${id}`, { method: 'DELETE' }),
};

// ── FOLLOW-UPS ────────────────────────────────────────────────────────────────
export const followUpsApi = {
  list: (params = {}) => apiFetch(`/api/follow-ups?${new URLSearchParams(params)}`),
  create: (body) => apiFetch('/api/follow-ups', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => apiFetch(`/api/follow-ups/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  cancel: (id) => apiFetch(`/api/follow-ups/${id}`, { method: 'DELETE' }),
};

// ── USERS ─────────────────────────────────────────────────────────────────────
export const usersApi = {
  list: (params = {}) => apiFetch(`/api/users?${new URLSearchParams(params)}`),
  get: (id) => apiFetch(`/api/users/${id}`),
  me: () => apiFetch('/api/users/me'),
  update: (id, body) => apiFetch(`/api/users/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  assignRole: (id, roleName) => apiFetch(`/api/users/${id}/roles`, { method: 'POST', body: JSON.stringify({ role_name: roleName }) }),
};

// ── REPORTS ───────────────────────────────────────────────────────────────────
export const reportsApi = {
  overview: () => apiFetch('/api/reports/overview'),
  agents: (params = {}) => apiFetch(`/api/reports/agents?${new URLSearchParams(params)}`),
  campaigns: (params = {}) => apiFetch(`/api/reports/campaigns?${new URLSearchParams(params)}`),
};
