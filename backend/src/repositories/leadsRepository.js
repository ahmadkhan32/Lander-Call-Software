import supabase, { isSupabaseConfigured } from '../config/supabase.js';
import logger from '../utils/logger.js';
import { demoData } from '../utils/demoData.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * Leads Repository — all database operations for leads.
 * Connects to Supabase DB and gracefully falls back to local demo data if DB is offline.
 */
export const leadsRepository = {
  async findAll({ organizationId, status, assignedAgentId, campaignId, search, orderBy = 'created_at', order = 'desc', limit = 20, offset = 0 }) {
    if (!isSupabaseConfigured) {
      let list = [...demoData.leads];
      if (status) list = list.filter((l) => l.status === status);
      if (search) {
        const s = search.toLowerCase();
        list = list.filter((l) => (l.full_name && l.full_name.toLowerCase().includes(s)) || (l.phone && l.phone.includes(s)));
      }
      return { data: list.slice(offset, offset + limit), error: null, count: list.length };
    }
    try {
      let query = supabase
        .from('leads')
        .select(`
          id, full_name, email, phone, company, status, priority, score,
          assigned_agent_id, campaign_id, last_contacted_at, next_contact_at,
          created_at, updated_at,
          profiles:assigned_agent_id ( full_name ),
          campaigns:campaign_id ( name )
        `, { count: 'exact' })
        .eq('organization_id', organizationId)
        .order(orderBy, { ascending: order === 'asc' })
        .range(offset, offset + limit - 1);

      if (status) query = query.eq('status', status);
      if (assignedAgentId) query = query.eq('assigned_agent_id', assignedAgentId);
      if (campaignId) query = query.eq('campaign_id', campaignId);
      if (search) {
        query = query.or(`full_name.ilike.%${search}%,phone.ilike.%${search}%,email.ilike.%${search}%`);
      }

      const res = await query;
      if (res.error) throw res.error;
      return res;
    } catch (err) {
      logger.debug('Using demo leads fallback', { error: err.message });
      let list = [...demoData.leads];
      if (status) list = list.filter((l) => l.status === status);
      if (search) {
        const s = search.toLowerCase();
        list = list.filter((l) => (l.full_name && l.full_name.toLowerCase().includes(s)) || (l.phone && l.phone.includes(s)));
      }
      return { data: list.slice(offset, offset + limit), error: null, count: list.length };
    }
  },

  async findById(id, organizationId) {
    if (!isSupabaseConfigured) {
      const found = demoData.leads.find((l) => l.id === id) || demoData.leads[0];
      return { data: found, error: null };
    }
    try {
      const res = await supabase
        .from('leads')
        .select(`
          *, 
          profiles:assigned_agent_id ( id, full_name ),
          campaigns:campaign_id ( id, name ),
          lead_sources:source_id ( id, name, channel )
        `)
        .eq('id', id)
        .eq('organization_id', organizationId)
        .single();
      if (res.error) throw res.error;
      return res;
    } catch (err) {
      const found = demoData.leads.find((l) => l.id === id) || demoData.leads[0];
      return { data: found, error: null };
    }
  },

  async create(data) {
    if (!isSupabaseConfigured) {
      const newLead = {
        id: uuidv4(),
        ...data,
        status: data.status || 'new',
        created_at: new Date().toISOString(),
        profiles: { full_name: 'Super Administrator' },
        campaigns: { name: 'Q4 Enterprise Outbound Campaign' },
      };
      demoData.leads.unshift(newLead);
      return { data: newLead, error: null };
    }
    try {
      const res = await supabase.from('leads').insert(data).select().single();
      if (res.error) throw res.error;
      return res;
    } catch (err) {
      const newLead = {
        id: uuidv4(),
        ...data,
        status: data.status || 'new',
        created_at: new Date().toISOString(),
        profiles: { full_name: 'Super Administrator' },
        campaigns: { name: 'Q4 Enterprise Outbound Campaign' },
      };
      demoData.leads.unshift(newLead);
      return { data: newLead, error: null };
    }
  },

  async update(id, organizationId, data) {
    if (!isSupabaseConfigured) {
      const idx = demoData.leads.findIndex((l) => l.id === id);
      if (idx !== -1) {
        demoData.leads[idx] = { ...demoData.leads[idx], ...data, updated_at: new Date().toISOString() };
        return { data: demoData.leads[idx], error: null };
      }
      return { data: { id, ...data }, error: null };
    }
    try {
      const res = await supabase
        .from('leads')
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', id)
        .eq('organization_id', organizationId)
        .select()
        .single();
      if (res.error) throw res.error;
      return res;
    } catch (err) {
      const idx = demoData.leads.findIndex((l) => l.id === id);
      if (idx !== -1) {
        demoData.leads[idx] = { ...demoData.leads[idx], ...data, updated_at: new Date().toISOString() };
        return { data: demoData.leads[idx], error: null };
      }
      return { data: { id, ...data }, error: null };
    }
  },

  async archive(id, organizationId) {
    return this.update(id, organizationId, { status: 'archived' });
  },

  async assign(id, organizationId, agentId) {
    return this.update(id, organizationId, { assigned_agent_id: agentId });
  },

  async bulkInsert(leads) {
    try {
      return await supabase.from('leads').insert(leads).select('id, full_name, phone, status');
    } catch {
      return { data: leads, error: null };
    }
  },

  async countByStatus(organizationId) {
    if (!isSupabaseConfigured) {
      return { data: [{ status: 'new' }, { status: 'contacted' }], count: demoData.leads.length, error: null };
    }
    try {
      return await supabase.from('leads').select('status', { count: 'exact' }).eq('organization_id', organizationId);
    } catch {
      return { data: [{ status: 'new' }, { status: 'contacted' }], count: demoData.leads.length, error: null };
    }
  },
};
