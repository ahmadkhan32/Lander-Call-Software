import supabase from '../config/supabase.js';

export const auditRepository = {
  /**
   * Insert an audit log entry. Called by services after important actions.
   * Uses service role — safe to call server-side only.
   */
  async log({ organizationId, actorId, action, resourceType, resourceId, oldValue, newValue, ipAddress, userAgent }) {
    const { error } = await supabase.from('audit_logs').insert({
      organization_id: organizationId,
      actor_id: actorId,
      action,
      resource_type: resourceType,
      resource_id: resourceId,
      old_value: oldValue ?? null,
      new_value: newValue ?? null,
      ip_address: ipAddress ?? null,
      user_agent: userAgent ?? null,
    });
    return error;
  },

  async findAll({ organizationId, actorId, action, resourceType, limit = 50, offset = 0 }) {
    let query = supabase
      .from('audit_logs')
      .select(`
        id, action, resource_type, resource_id, old_value, new_value,
        ip_address, created_at,
        profiles:actor_id ( full_name )
      `, { count: 'exact' })
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (actorId) query = query.eq('actor_id', actorId);
    if (action) query = query.eq('action', action);
    if (resourceType) query = query.eq('resource_type', resourceType);

    return query;
  },
};
