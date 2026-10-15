import express from 'express';
import { z } from 'zod';
import supabase from '../../config/supabase.js';
import { auditRepository } from '../../repositories/auditRepository.js';
import { authenticate, requirePermission } from '../../middleware/auth.js';
import { successResponse, errorResponse, validateBody, handleDbError } from '../../utils/helpers.js';
import logger from '../../utils/logger.js';

const router = express.Router();

// POST /api/webhooks/telephony
// Receives events from the telephony provider.
// This route should NOT use the authenticate middleware — it uses a webhook secret instead.
router.post('/telephony', async (req, res) => {
  const signature = req.headers['x-webhook-signature'] || req.headers['x-twilio-signature'] || '';
  const webhookSecret = process.env.TELEPHONY_WEBHOOK_SECRET;

  // Basic secret validation — replace with HMAC verification per provider
  if (webhookSecret && signature !== webhookSecret) {
    logger.warn('Webhook signature mismatch', { signature });
    return res.status(401).json({ error: 'Invalid webhook signature' });
  }

  const { provider = 'unknown', event_id, event_type, ...payload } = req.body;

  if (!event_id || !event_type) {
    return res.status(400).json({ error: 'event_id and event_type are required' });
  }

  // Check idempotency
  const { data: existing } = await supabase
    .from('webhook_events')
    .select('id, status')
    .eq('provider', provider)
    .eq('event_id', event_id)
    .maybeSingle();

  if (existing) {
    logger.info('Duplicate webhook event — ignoring', { provider, event_id });
    await supabase
      .from('webhook_events')
      .update({ status: 'duplicate' })
      .eq('id', existing.id);
    return res.status(200).json({ message: 'Duplicate event acknowledged' });
  }

  // Insert and process
  const { data: webhookRow, error: insertError } = await supabase
    .from('webhook_events')
    .insert({ provider, event_id, event_type, payload: req.body, status: 'received' })
    .select()
    .single();

  if (insertError) {
    logger.error('Failed to insert webhook event', { error: insertError.message });
    return res.status(500).json({ error: 'Failed to store event' });
  }

  // Process asynchronously
  setImmediate(() => processTelephonyEvent(webhookRow, provider, event_type, payload));

  return res.status(200).json({ message: 'Event received' });
});

async function processTelephonyEvent(webhookRow, provider, event_type, payload) {
  try {
    await supabase
      .from('webhook_events')
      .update({ status: 'processing' })
      .eq('id', webhookRow.id);

    if (event_type === 'call.completed' || event_type === 'call-status') {
      const callId = payload.provider_call_id || payload.CallSid || payload.call_id;
      if (callId) {
        const { data: call } = await supabase
          .from('calls')
          .select('id')
          .eq('provider', provider)
          .eq('provider_call_id', callId)
          .maybeSingle();

        if (call) {
          await supabase.from('calls').update({
            status: 'completed',
            ended_at: payload.ended_at || new Date().toISOString(),
            duration_seconds: parseInt(payload.duration || payload.CallDuration || '0', 10),
            updated_at: new Date().toISOString(),
          }).eq('id', call.id);
        }
      }
    }

    await supabase
      .from('webhook_events')
      .update({ status: 'processed', processed_at: new Date().toISOString() })
      .eq('id', webhookRow.id);

    logger.info('Webhook event processed', { provider, event_type, webhookId: webhookRow.id });
  } catch (err) {
    logger.error('Webhook processing failed', { error: err.message, webhookId: webhookRow.id });
    await supabase
      .from('webhook_events')
      .update({ status: 'failed', error: err.message })
      .eq('id', webhookRow.id);
  }
}

export default router;
