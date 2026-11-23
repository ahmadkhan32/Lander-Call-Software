import express from 'express';
import { z } from 'zod';
import { authenticate, requirePermission } from '../../middleware/auth.js';
import { parsePagination, successResponse, errorResponse, validateBody, handleDbError } from '../../utils/helpers.js';
import { sendWhatsAppMessage, normalizePhoneNumber, twilioConfig } from '../../config/twilio.js';
import { auditRepository } from '../../repositories/auditRepository.js';
import supabase from '../../config/supabase.js';
import logger from '../../utils/logger.js';

const router = express.Router();

// Mock store fallback when Supabase messages table is empty or offline
let memoryMessages = [
  {
    id: 'wa_msg_01',
    organization_id: '00000000-0000-0000-0000-000000000001',
    lead_id: 'lead_001',
    sender_phone: '+923470838718',
    recipient_phone: '+923001234567',
    direction: 'outbound',
    body: 'Hello! Thank you for inquiring about LANDER CRM. Would you like to schedule a quick demo this afternoon?',
    status: 'delivered',
    channel: 'whatsapp',
    created_at: new Date(Date.now() - 3600000 * 3).toISOString(),
  },
  {
    id: 'wa_msg_02',
    organization_id: '00000000-0000-0000-0000-000000000001',
    lead_id: 'lead_001',
    sender_phone: '+923001234567',
    recipient_phone: '+923470838718',
    direction: 'inbound',
    body: 'Yes, 3:00 PM works perfectly for me. Does the dialer support Pakistan mobile and UK routes?',
    status: 'read',
    channel: 'whatsapp',
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'wa_msg_03',
    organization_id: '00000000-0000-0000-0000-000000000001',
    lead_id: 'lead_001',
    sender_phone: '+923470838718',
    recipient_phone: '+923001234567',
    direction: 'outbound',
    body: 'Yes! LANDER supports Pakistan (+92), UK (+44), Ireland (+353), and global SIP calling natively with live caller ID.',
    status: 'read',
    channel: 'whatsapp',
    created_at: new Date(Date.now() - 3600000 * 1).toISOString(),
  },
  {
    id: 'wa_msg_04',
    organization_id: '00000000-0000-0000-0000-000000000001',
    lead_id: 'lead_002',
    sender_phone: '+923470838718',
    recipient_phone: '+447911123456',
    direction: 'outbound',
    body: 'Good morning from LANDER! Following up on your call yesterday regarding our UK telephony plan.',
    status: 'delivered',
    channel: 'whatsapp',
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
];

const sendSchema = z.object({
  lead_id: z.string().optional().nullable(),
  to: z.string().min(5),
  body: z.string().min(1).max(4096),
  media_url: z.string().url().optional().nullable(),
});

// GET /api/whatsapp/messages
router.get('/messages', authenticate, requirePermission('leads.read'), async (req, res) => {
  const { lead_id, phone, direction } = req.query;
  const { page, limit, offset } = parsePagination(req.query);

  try {
    const { data: dbData, error } = await supabase
      .from('messages')
      .select('*')
      .eq('organization_id', req.user.organizationId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (!error && dbData && dbData.length > 0) {
      let filtered = dbData;
      if (lead_id) filtered = filtered.filter((m) => m.lead_id === lead_id);
      if (phone) filtered = filtered.filter((m) => m.recipient_phone?.includes(phone) || m.sender_phone?.includes(phone));
      return successResponse(res, {
        messages: filtered,
        pagination: { page, limit, total: filtered.length },
      });
    }
  } catch (err) {
    logger.debug('[WhatsApp] Falling back to memory store');
  }

  let filtered = [...memoryMessages];
  if (lead_id) filtered = filtered.filter((m) => m.lead_id === lead_id);
  if (phone) filtered = filtered.filter((m) => m.recipient_phone?.includes(phone) || m.sender_phone?.includes(phone));
  if (direction) filtered = filtered.filter((m) => m.direction === direction);

  return successResponse(res, {
    messages: filtered,
    pagination: { page, limit, total: filtered.length },
    activeSender: twilioConfig.callerId,
  });
});

// POST /api/whatsapp/send
router.post('/send', authenticate, requirePermission('leads.update'), async (req, res) => {
  const body = validateBody(sendSchema, req.body, res);
  if (!body) return;

  const normalizedTo = normalizePhoneNumber(body.to);
  const senderPhone = twilioConfig.callerId || '+923470838718';

  const twilioResult = await sendWhatsAppMessage({
    to: normalizedTo,
    from: `whatsapp:${senderPhone}`,
    body: body.body,
    mediaUrl: body.media_url,
  });

  const newMsg = {
    id: twilioResult.messageId || `wa_${Date.now()}`,
    organization_id: req.user.organizationId,
    lead_id: body.lead_id || null,
    sender_phone: senderPhone,
    recipient_phone: normalizedTo,
    direction: 'outbound',
    body: body.body,
    status: twilioResult.status || 'sent',
    channel: 'whatsapp',
    created_at: new Date().toISOString(),
  };

  memoryMessages.unshift(newMsg);

  try {
    await supabase.from('messages').insert({
      id: newMsg.id.startsWith('wa_') && newMsg.id.length === 36 ? newMsg.id : undefined,
      organization_id: req.user.organizationId,
      lead_id: body.lead_id || null,
      sender_phone: senderPhone,
      recipient_phone: normalizedTo,
      direction: 'outbound',
      body: body.body,
      status: twilioResult.status || 'sent',
      channel: 'whatsapp',
    });
  } catch {
    // Ignore db write failure, memory store is active
  }

  await auditRepository.log({
    organizationId: req.user.organizationId,
    actorId: req.user.id,
    action: 'whatsapp.message_sent',
    resourceType: 'message',
    resourceId: newMsg.id,
    newValue: { to: normalizedTo, body: body.body.slice(0, 100) },
  });

  return successResponse(res, {
    message: newMsg,
    twilio: twilioResult,
  }, 201);
});

// POST /api/whatsapp/simulate-inbound
router.post('/simulate-inbound', authenticate, requirePermission('leads.update'), async (req, res) => {
  const { from = '+923001234567', body = 'Thanks for reaching out! Looking forward to testing LANDER CRM.', lead_id } = req.body;
  const normalizedFrom = normalizePhoneNumber(from);

  const inboundMsg = {
    id: `wa_inbound_${Date.now()}`,
    organization_id: req.user.organizationId,
    lead_id: lead_id || null,
    sender_phone: normalizedFrom,
    recipient_phone: twilioConfig.callerId,
    direction: 'inbound',
    body,
    status: 'received',
    channel: 'whatsapp',
    created_at: new Date().toISOString(),
  };

  memoryMessages.unshift(inboundMsg);

  return successResponse(res, {
    message: inboundMsg,
    notification: `New WhatsApp message from ${normalizedFrom}`,
  }, 201);
});

// DELETE /api/whatsapp/messages/:id
router.delete('/messages/:id', authenticate, requirePermission('leads.update'), async (req, res) => {
  const { id } = req.params;
  memoryMessages = memoryMessages.filter((m) => m.id !== id);

  try {
    await supabase.from('messages').delete().eq('id', id).eq('organization_id', req.user.organizationId);
  } catch {}

  return successResponse(res, { success: true, deletedId: id });
});

export default router;
