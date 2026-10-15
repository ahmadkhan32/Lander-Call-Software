import supabase from '../../config/supabase.js';
import { leadsRepository } from '../../repositories/leadsRepository.js';
import { auditRepository } from '../../repositories/auditRepository.js';
import logger from '../../utils/logger.js';

class LeadRouterService {
  /**
   * Find available agents for an organization and optional team.
   */
  async getAvailableAgents(organizationId, teamId = null) {
    let query = supabase
      .from('profiles')
      .select('id, full_name, status')
      .eq('organization_id', organizationId)
      .eq('status', 'active');

    if (teamId) {
      const { data: teamMembers } = await supabase
        .from('team_members')
        .select('user_id')
        .eq('team_id', teamId);
      const userIds = (teamMembers || []).map((m) => m.user_id);
      if (userIds.length > 0) {
        query = query.in('id', userIds);
      }
    }

    const { data: agents, error } = await query;
    if (error) {
      logger.error('Failed to get available agents', { error: error.message });
      return [];
    }
    return agents || [];
  }

  /**
   * Route a single lead to the least loaded available agent.
   */
  async routeLead({ leadId, organizationId, actorId, teamId = null }) {
    const agents = await this.getAvailableAgents(organizationId, teamId);
    if (!agents.length) {
      logger.warn('No active agents available for routing lead', { leadId, organizationId });
      return { assigned: false, reason: 'No active agents available' };
    }

    // Get current lead counts for each candidate agent
    const agentCounts = await Promise.all(
      agents.map(async (agent) => {
        const { count } = await supabase
          .from('leads')
          .select('id', { count: 'exact' })
          .eq('assigned_agent_id', agent.id)
          .eq('organization_id', organizationId)
          .in('status', ['new', 'contacted', 'qualified']);
        return { agent, count: count || 0 };
      })
    );

    // Pick agent with minimum active lead count (least-loaded round-robin)
    agentCounts.sort((a, b) => a.count - b.count);
    const selectedAgent = agentCounts[0].agent;

    // Assign the lead
    const { data: updatedLead, error } = await leadsRepository.assign(
      leadId,
      organizationId,
      selectedAgent.id
    );

    if (error) {
      logger.error('Failed to assign lead in DB', { error: error.message });
      throw new Error('Lead assignment failed');
    }

    // Audit log
    await auditRepository.log({
      organizationId,
      actorId: actorId || selectedAgent.id,
      action: 'leads.routed',
      resourceType: 'lead',
      resourceId: leadId,
      newValue: {
        assigned_agent_id: selectedAgent.id,
        agent_name: selectedAgent.full_name,
        strategy: 'least-loaded-round-robin',
      },
    });

    logger.info(`Lead ${leadId} automatically routed to agent ${selectedAgent.full_name} (${selectedAgent.id})`);

    return {
      assigned: true,
      lead: updatedLead,
      assignedTo: {
        id: selectedAgent.id,
        name: selectedAgent.full_name,
      },
    };
  }

  /**
   * Batch route all unassigned new leads in an organization or campaign.
   */
  async batchDistribute({ organizationId, campaignId = null, actorId, limit = 50 }) {
    let query = supabase
      .from('leads')
      .select('id')
      .eq('organization_id', organizationId)
      .is('assigned_agent_id', null)
      .eq('status', 'new')
      .limit(limit);

    if (campaignId) query = query.eq('campaign_id', campaignId);

    const { data: unassignedLeads, error } = await query;
    if (error) throw new Error('Failed to retrieve unassigned leads');

    const results = [];
    for (const lead of unassignedLeads || []) {
      try {
        const res = await this.routeLead({
          leadId: lead.id,
          organizationId,
          actorId,
        });
        results.push({ leadId: lead.id, ...res });
      } catch (err) {
        results.push({ leadId: lead.id, assigned: false, error: err.message });
      }
    }

    return {
      totalFound: (unassignedLeads || []).length,
      assignedCount: results.filter((r) => r.assigned).length,
      details: results,
    };
  }
}

export default new LeadRouterService();
