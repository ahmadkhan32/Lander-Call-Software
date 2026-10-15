import express from 'express';
import { z } from 'zod';
import { callsRepository } from '../../repositories/callsRepository.js';
import { auditRepository } from '../../repositories/auditRepository.js';
import { authenticate, requirePermission } from '../../middleware/auth.js';
import { parsePagination, successResponse, errorResponse, validateBody, handleDbError } from '../../utils/helpers.js';
import logger from '../../utils/logger.js';

const router = express.Router();

const createCallSchema = z.object({
  lead_id: z.string().uuid().optional().nullable(),
  campaign_id: z.string().uuid().optional().nullable(),
  direction: z.enum(['inbound', 'outbound']).default('outbound'),
  phone_from: z.string().optional().nullable(),
  phone_to: z.string().optional().nullable(),
  provider: z.string().default('unknown'),
  provider_call_id: z.string().optional().nullable(),
  started_at: z.string().datetime().optional().nullable(),
});

const updateCallSchema = z.object({
  status: z.enum(['initiated', 'ringing', 'in_progress', 'completed', 'failed', 'no_answer', 'busy', 'cancelled']).optional(),
  disposition_id: z.string().uuid().optional().nullable(),
  answered_at: z.string().datetime().optional().nullable(),
  ended_at: z.string().datetime().optional().nullable(),
  duration_seconds: z.number().int().min(0).optional(),
  talk_time_seconds: z.number().int().min(0).optional(),
  notes: z.string().max(5000).optional().nullable(),
  outcome: z.string().max(500).optional().nullable(),
});

// GET /api/calls
router.get('/', authenticate, requirePermission('calls.read'), async (req, res) => {
  const { page, limit, offset } = parsePagination(req.query);
  const { agent_id, lead_id, campaign_id, direction, status, start_date, end_date } = req.query;

  const { data, error, count } = await callsRepository.findAll({
    organizationId: req.user.organizationId,
    agentId: agent_id,
    leadId: lead_id,
    campaignId: campaign_id,
    direction,
    status,
    startDate: start_date,
    endDate: end_date,
    limit,
    offset,
  });

  if (error) return handleDbError(error, logger, res, 'Failed to retrieve calls');
  return successResponse(res, {
    calls: data,
    pagination: { page, limit, total: count, pages: Math.ceil(count / limit) },
  });
});

// GET /api/calls/:id
router.get('/:id', authenticate, requirePermission('calls.read'), async (req, res) => {
  const { data, error } = await callsRepository.findById(req.params.id, req.user.organizationId);
  if (error || !data) return errorResponse(res, 'Call not found', 404);
  return successResponse(res, { call: data });
});

// POST /api/calls
router.post('/', authenticate, requirePermission('calls.initiate'), async (req, res) => {
  const body = validateBody(createCallSchema, req.body, res);
  if (!body) return;

  const { data, error } = await callsRepository.create({
    ...body,
    agent_id: req.user.id,
    organization_id: req.user.organizationId,
  });

  if (error) return handleDbError(error, logger, res, 'Failed to create call');

  await auditRepository.log({
    organizationId: req.user.organizationId,
    actorId: req.user.id,
    action: 'calls.created',
    resourceType: 'call',
    resourceId: data.id,
    newValue: { direction: data.direction, lead_id: data.lead_id },
    ipAddress: req.ip,
  });

  return successResponse(res, { call: data }, 201);
});

import telephonyService from '../../services/telephony/telephonyService.js';

// POST /api/calls/dial (Initiates live softphone/telephony outbound call)
router.post('/dial', authenticate, requirePermission('calls.initiate'), async (req, res) => {
  const dialSchema = z.object({
    phone_to: z.string().min(3).max(30).optional(),
    lead_id: z.string().uuid().optional().nullable(),
    campaign_id: z.string().uuid().optional().nullable(),
    phone_from: z.string().optional().nullable(),
  });

  const body = validateBody(dialSchema, req.body, res);
  if (!body) return;

  try {
    const result = await telephonyService.dial({
      organizationId: req.user.organizationId,
      agentId: req.user.id,
      leadId: body.lead_id,
      campaignId: body.campaign_id,
      phoneTo: body.phone_to,
      phoneFrom: body.phone_from,
    });
    return successResponse(res, result, 201);
  } catch (err) {
    logger.error('Dial failed', { error: err.message });
    return errorResponse(res, err.message || 'Call initiation failed', 400);
  }
});

// POST /api/calls/:id/hangup (Ends active call)
router.post('/:id/hangup', authenticate, requirePermission('calls.update'), async (req, res) => {
  try {
    const updated = await telephonyService.hangup({
      callId: req.params.id,
      organizationId: req.user.organizationId,
      agentId: req.user.id,
    });
    return successResponse(res, { call: updated });
  } catch (err) {
    logger.error('Hangup failed', { error: err.message });
    return errorResponse(res, err.message || 'Call hangup failed', 400);
  }
});

// POST /api/calls/:id/disposition (Wraps up call with outcome, notes, and optional follow-up)
router.post('/:id/disposition', authenticate, requirePermission('calls.update'), async (req, res) => {
  const dispSchema = z.object({
    disposition_name: z.string().optional().nullable(),
    notes: z.string().max(5000).optional().nullable(),
    outcome: z.string().max(500).optional().nullable(),
    follow_up_date: z.string().optional().nullable(),
  });

  const body = validateBody(dispSchema, req.body, res);
  if (!body) return;

  try {
    const updated = await telephonyService.setDisposition({
      callId: req.params.id,
      organizationId: req.user.organizationId,
      agentId: req.user.id,
      dispositionName: body.disposition_name,
      notes: body.notes,
      outcome: body.outcome,
      followUpDate: body.follow_up_date,
    });
    return successResponse(res, { call: updated });
  } catch (err) {
    logger.error('Set disposition failed', { error: err.message });
    return errorResponse(res, err.message || 'Failed to record disposition', 400);
  }
});

// PATCH /api/calls/:id
router.patch('/:id', authenticate, requirePermission('calls.update'), async (req, res) => {
  const body = validateBody(updateCallSchema, req.body, res);
  if (!body) return;

  const { data, error } = await callsRepository.update(req.params.id, req.user.organizationId, body);
  if (error || !data) return handleDbError(error, logger, res, 'Failed to update call');

  return successResponse(res, { call: data });
});

export default router;

