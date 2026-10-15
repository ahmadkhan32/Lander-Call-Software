import mockProvider from './mockProvider.js';
import twilioProvider from './twilioProvider.js';
import { callsRepository } from '../../repositories/callsRepository.js';
import { auditRepository } from '../../repositories/auditRepository.js';
import supabase from '../../config/supabase.js';
import logger from '../../utils/logger.js';

class TelephonyService {
  /**
   * Determine the active provider based on configuration.
   */
  getProvider(preferredProvider) {
    if (preferredProvider === 'twilio' && twilioProvider.isConfigured()) {
      return twilioProvider;
    }
    if (twilioProvider.isConfigured()) {
      return twilioProvider;
    }
    return mockProvider;
  }

  /**
   * Initiate an outbound call from agent to lead or external number.
   */
  async dial({ organizationId, agentId, leadId, campaignId, phoneTo, phoneFrom }) {
    // 1. Resolve lead info if leadId is provided
    let destinationPhone = phoneTo;
    if (!destinationPhone && leadId) {
      const { data: lead } = await supabase
        .from('leads')
        .select('phone')
        .eq('id', leadId)
        .eq('organization_id', organizationId)
        .single();
      if (lead) destinationPhone = lead.phone;
    }

    if (!destinationPhone) {
      throw new Error('Destination phone number is required');
    }

    const provider = this.getProvider();

    // 2. Insert call record into database as 'initiated'
    const { data: call, error: dbError } = await callsRepository.create({
      organization_id: organizationId,
      agent_id: agentId,
      lead_id: leadId || null,
      campaign_id: campaignId || null,
      direction: 'outbound',
      phone_from: phoneFrom || '+15551234567',
      phone_to: destinationPhone,
      provider: provider.name,
      status: 'initiated',
      started_at: new Date().toISOString(),
    });

    if (dbError) {
      logger.error('Failed to create call in DB', { error: dbError.message });
      throw new Error('Failed to record call');
    }

    // 3. Initiate with provider
    try {
      const providerRes = await provider.initiateCall({
        callId: call.id,
        from: phoneFrom,
        to: destinationPhone,
        leadId,
        agentId,
      });

      // Update with providerCallId
      await callsRepository.update(call.id, organizationId, {
        provider_call_id: providerRes.providerCallId,
        status: 'ringing',
      });

      // Audit log
      await auditRepository.log({
        organizationId,
        actorId: agentId,
        action: 'calls.dialed',
        resourceType: 'call',
        resourceId: call.id,
        newValue: { destinationPhone, provider: provider.name },
      });

      return {
        callId: call.id,
        providerCallId: providerRes.providerCallId,
        status: 'ringing',
        phoneTo: destinationPhone,
        provider: provider.name,
      };
    } catch (err) {
      await callsRepository.update(call.id, organizationId, {
        status: 'failed',
        ended_at: new Date().toISOString(),
      });
      throw err;
    }
  }

  /**
   * Terminate an active call.
   */
  async hangup({ callId, organizationId, agentId }) {
    const { data: call } = await callsRepository.findById(callId, organizationId);
    if (!call) throw new Error('Call not found');

    const provider = this.getProvider(call.provider);
    if (call.provider_call_id) {
      await provider.hangupCall(call.provider_call_id);
    }

    const endedAt = new Date().toISOString();
    const durationSeconds = call.started_at
      ? Math.max(1, Math.round((new Date(endedAt) - new Date(call.started_at)) / 1000))
      : 0;

    const { data: updatedCall } = await callsRepository.update(callId, organizationId, {
      status: 'completed',
      ended_at: endedAt,
      duration_seconds: durationSeconds,
      talk_time_seconds: Math.max(0, durationSeconds - 3),
    });

    // Update agent activity if needed
    if (agentId) {
      await auditRepository.log({
        organizationId,
        actorId: agentId,
        action: 'calls.hangup',
        resourceType: 'call',
        resourceId: callId,
        newValue: { durationSeconds },
      });
    }

    return updatedCall;
  }

  /**
   * Submit disposition and wrap up the call.
   */
  async setDisposition({ callId, organizationId, agentId, dispositionName, notes, outcome, followUpDate }) {
    const { data: call } = await callsRepository.findById(callId, organizationId);
    if (!call) throw new Error('Call not found');

    // 1. Look up disposition ID if dispositionName provided
    let dispositionId = null;
    if (dispositionName) {
      const { data: disp } = await supabase
        .from('call_dispositions')
        .select('id')
        .eq('name', dispositionName)
        .maybeSingle();
      if (disp) dispositionId = disp.id;
    }

    // 2. Update call
    const updateData = {
      notes: notes || call.notes,
      outcome: outcome || dispositionName,
    };
    if (dispositionId) updateData.disposition_id = dispositionId;

    const { data: updatedCall } = await callsRepository.update(callId, organizationId, updateData);

    // 3. Update lead status if lead attached
    if (call.lead_id) {
      let leadStatus = 'contacted';
      if (dispositionName?.toLowerCase().includes('convert') || dispositionName?.toLowerCase().includes('sale')) {
        leadStatus = 'converted';
      } else if (dispositionName?.toLowerCase().includes('not interested') || dispositionName?.toLowerCase().includes('do not call')) {
        leadStatus = 'lost';
      }

      await supabase
        .from('leads')
        .update({
          status: leadStatus,
          last_contacted_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', call.lead_id)
        .eq('organization_id', organizationId);

      // 4. Optionally schedule follow-up
      if (followUpDate) {
        await supabase.from('follow_ups').insert({
          organization_id: organizationId,
          lead_id: call.lead_id,
          call_id: callId,
          assigned_agent_id: agentId,
          created_by: agentId,
          due_at: new Date(followUpDate).toISOString(),
          notes: notes ? `Follow-up from call: ${notes}` : 'Scheduled call follow-up',
          type: 'callback',
          status: 'pending',
        });
      }
    }

    return updatedCall;
  }
}

export default new TelephonyService();
