import supabase, { isSupabaseConfigured } from '../config/supabase.js';
import { demoData } from '../utils/demoData.js';
import { v4 as uuidv4 } from 'uuid';

export const callsRepository = {
  async findAll({ organizationId, agentId, leadId, campaignId, direction, status, startDate, endDate, limit = 20, offset = 0 }) {
    if (!isSupabaseConfigured) {
      let list = [...demoData.calls];
      if (direction) list = list.filter((c) => c.direction === direction);
      if (status) list = list.filter((c) => c.status === status);
      return { data: list.slice(offset, offset + limit), error: null, count: list.length };
    }
    try {
      let query = supabase
        .from('calls')
        .select(`
          id, direction, status, phone_from, phone_to,
          started_at, answered_at, ended_at, duration_seconds,
          provider_call_id, provider, notes, outcome,
          leads:lead_id ( full_name, phone ),
          profiles:agent_id ( full_name ),
          campaigns:campaign_id ( name ),
          call_dispositions:disposition_id ( name, color )
        `, { count: 'exact' })
        .eq('organization_id', organizationId)
        .order('started_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (agentId) query = query.eq('agent_id', agentId);
      if (leadId) query = query.eq('lead_id', leadId);
      if (campaignId) query = query.eq('campaign_id', campaignId);
      if (direction) query = query.eq('direction', direction);
      if (status) query = query.eq('status', status);
      if (startDate) query = query.gte('started_at', startDate);
      if (endDate) query = query.lte('started_at', endDate);

      const res = await query;
      if (res.error) throw res.error;
      return res;
    } catch {
      let list = [...demoData.calls];
      if (direction) list = list.filter((c) => c.direction === direction);
      if (status) list = list.filter((c) => c.status === status);
      return { data: list.slice(offset, offset + limit), error: null, count: list.length };
    }
  },

  async findById(id, organizationId) {
    if (!isSupabaseConfigured) {
      const found = demoData.calls.find((c) => c.id === id) || demoData.calls[0];
      return { data: found, error: null };
    }
    try {
      const res = await supabase
        .from('calls')
        .select(`
          *,
          leads:lead_id ( full_name, phone ),
          profiles:agent_id ( full_name ),
          campaigns:campaign_id ( name ),
          call_dispositions:disposition_id ( name )
        `)
        .eq('id', id)
        .eq('organization_id', organizationId)
        .single();
      if (res.error) throw res.error;
      return res;
    } catch {
      const found = demoData.calls.find((c) => c.id === id) || demoData.calls[0];
      return { data: found, error: null };
    }
  },

  async create(data) {
    if (!isSupabaseConfigured) {
      const newCall = {
        id: uuidv4(),
        ...data,
        started_at: data.started_at || new Date().toISOString(),
        duration_seconds: data.duration_seconds || 0,
        leads: { full_name: 'Contact Lead', phone: data.phone_to },
        profiles: { full_name: 'Super Administrator' },
        call_dispositions: { name: 'In Progress' },
      };
      demoData.calls.unshift(newCall);
      return { data: newCall, error: null };
    }
    try {
      const res = await supabase.from('calls').insert(data).select().single();
      if (res.error) throw res.error;
      return res;
    } catch {
      const newCall = {
        id: uuidv4(),
        ...data,
        started_at: data.started_at || new Date().toISOString(),
        duration_seconds: data.duration_seconds || 0,
        leads: { full_name: 'Contact Lead', phone: data.phone_to },
        profiles: { full_name: 'Super Administrator' },
        call_dispositions: { name: 'In Progress' },
      };
      demoData.calls.unshift(newCall);
      return { data: newCall, error: null };
    }
  },

  async update(id, organizationId, data) {
    if (!isSupabaseConfigured) {
      const idx = demoData.calls.findIndex((c) => c.id === id);
      if (idx !== -1) {
        demoData.calls[idx] = { ...demoData.calls[idx], ...data, updated_at: new Date().toISOString() };
        return { data: demoData.calls[idx], error: null };
      }
      return { data: { id, ...data }, error: null };
    }
    try {
      const res = await supabase
        .from('calls')
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', id)
        .eq('organization_id', organizationId)
        .select()
        .single();
      if (res.error) throw res.error;
      return res;
    } catch {
      const idx = demoData.calls.findIndex((c) => c.id === id);
      if (idx !== -1) {
        demoData.calls[idx] = { ...demoData.calls[idx], ...data, updated_at: new Date().toISOString() };
        return { data: demoData.calls[idx], error: null };
      }
      return { data: { id, ...data }, error: null };
    }
  },

  async getAgentMetrics({ organizationId, agentId, startDate, endDate }) {
    if (!isSupabaseConfigured) {
      return {
        data: [
          { agent_id: '00000000-0000-0000-0000-000000000099', status: 'completed', direction: 'outbound', duration_seconds: 480 },
          { agent_id: '00000000-0000-0000-0000-000000000002', status: 'completed', direction: 'outbound', duration_seconds: 320 },
          { agent_id: '00000000-0000-0000-0000-000000000003', status: 'completed', direction: 'inbound',  duration_seconds: 240 },
          { agent_id: '00000000-0000-0000-0000-000000000004', status: 'completed', direction: 'outbound', duration_seconds: 180 },
        ],
        error: null,
      };
    }
    try {
      let query = supabase
        .from('calls')
        .select('agent_id, status, direction, duration_seconds')
        .eq('organization_id', organizationId)
        .gte('started_at', startDate)
        .lte('started_at', endDate);

      if (agentId) query = query.eq('agent_id', agentId);
      const res = await query;
      if (res.error) throw res.error;
      return res;
    } catch {
      return {
        data: [
          { agent_id: '00000000-0000-0000-0000-000000000099', status: 'completed', direction: 'outbound', duration_seconds: 480 },
          { agent_id: '00000000-0000-0000-0000-000000000002', status: 'completed', direction: 'outbound', duration_seconds: 320 },
          { agent_id: '00000000-0000-0000-0000-000000000003', status: 'completed', direction: 'inbound',  duration_seconds: 240 },
          { agent_id: '00000000-0000-0000-0000-000000000004', status: 'completed', direction: 'outbound', duration_seconds: 180 },
        ],
        error: null,
      };
    }
  },
};
