import { z } from 'zod';
import { leadsRepository } from '../../repositories/leadsRepository.js';
import { auditRepository } from '../../repositories/auditRepository.js';
import { parsePagination, successResponse, errorResponse, validateBody, handleDbError } from '../../utils/helpers.js';
import { authenticate, requirePermission } from '../../middleware/auth.js';
import express from 'express';
import logger from '../../utils/logger.js';
import leadRouterService from '../../services/routing/leadRouterService.js';

const router = express.Router();


// Validation schemas
const createLeadSchema = z.object({
  full_name: z.string().min(1).max(200),
  phone: z.string().min(5).max(30),
  email: z.string().email().optional().nullable(),
  company: z.string().max(200).optional().nullable(),
  campaign_id: z.string().uuid().optional().nullable(),
  source_id: z.string().uuid().optional().nullable(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  notes: z.string().max(5000).optional().nullable(),
  tags: z.array(z.string()).optional().default([]),
  custom_fields: z.record(z.unknown()).optional().default({}),
});

const updateLeadSchema = createLeadSchema.partial().extend({
  status: z.enum(['new', 'contacted', 'qualified', 'converted', 'lost', 'archived']).optional(),
  score: z.number().int().min(0).max(100).optional(),
  next_contact_at: z.string().datetime().optional().nullable(),
});

// GET /api/leads
router.get('/', authenticate, requirePermission('leads.read'), async (req, res) => {
  try {
    const { page, limit, offset } = parsePagination(req.query);
    const { status, assigned_agent_id, campaign_id, search, order_by, order } = req.query;

    const { data, error, count } = await leadsRepository.findAll({
      organizationId: req.user.organizationId,
      status,
      assignedAgentId: assigned_agent_id,
      campaignId: campaign_id,
      search,
      orderBy: order_by || 'created_at',
      order: order || 'desc',
      limit,
      offset,
    });

    if (error) return handleDbError(error, logger, res, 'Failed to retrieve leads');

    return successResponse(res, {
      leads: data,
      pagination: { page, limit, total: count, pages: Math.ceil(count / limit) },
    });
  } catch (err) {
    logger.error('GET /leads error', { err });
    return errorResponse(res, 'Failed to retrieve leads');
  }
});

// GET /api/leads/:id
router.get('/:id', authenticate, requirePermission('leads.read'), async (req, res) => {
  const { data, error } = await leadsRepository.findById(req.params.id, req.user.organizationId);
  if (error || !data) return errorResponse(res, 'Lead not found', 404);
  return successResponse(res, { lead: data });
});

// POST /api/leads
router.post('/', authenticate, requirePermission('leads.create'), async (req, res) => {
  const body = validateBody(createLeadSchema, req.body, res);
  if (!body) return;

  const { data, error } = await leadsRepository.create({
    ...body,
    organization_id: req.user.organizationId,
  });

  if (error) return handleDbError(error, logger, res, 'Failed to create lead');

  await auditRepository.log({
    organizationId: req.user.organizationId,
    actorId: req.user.id,
    action: 'leads.created',
    resourceType: 'lead',
    resourceId: data.id,
    newValue: { full_name: data.full_name, phone: data.phone },
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
  });

  return successResponse(res, { lead: data }, 201);
});

// PATCH /api/leads/:id
router.patch('/:id', authenticate, requirePermission('leads.update'), async (req, res) => {
  const body = validateBody(updateLeadSchema, req.body, res);
  if (!body) return;

  // Get old values for audit
  const { data: old } = await leadsRepository.findById(req.params.id, req.user.organizationId);
  if (!old) return errorResponse(res, 'Lead not found', 404);

  const { data, error } = await leadsRepository.update(req.params.id, req.user.organizationId, body);
  if (error) return handleDbError(error, logger, res, 'Failed to update lead');

  await auditRepository.log({
    organizationId: req.user.organizationId,
    actorId: req.user.id,
    action: 'leads.updated',
    resourceType: 'lead',
    resourceId: data.id,
    oldValue: old,
    newValue: body,
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
  });

  return successResponse(res, { lead: data });
});

// DELETE /api/leads/:id  (archives, does not hard-delete)
router.delete('/:id', authenticate, requirePermission('leads.archive'), async (req, res) => {
  const { data, error } = await leadsRepository.archive(req.params.id, req.user.organizationId);
  if (error || !data) return errorResponse(res, 'Lead not found or already archived', 404);

  await auditRepository.log({
    organizationId: req.user.organizationId,
    actorId: req.user.id,
    action: 'leads.archived',
    resourceType: 'lead',
    resourceId: data.id,
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
  });

  return successResponse(res, { lead: data });
});

// POST /api/leads/:id/assign
router.post('/:id/assign', authenticate, requirePermission('leads.assign'), async (req, res) => {
  const schema = z.object({ agent_id: z.string().uuid() });
  const body = validateBody(schema, req.body, res);
  if (!body) return;

  const { data: old } = await leadsRepository.findById(req.params.id, req.user.organizationId);
  if (!old) return errorResponse(res, 'Lead not found', 404);

  const { data, error } = await leadsRepository.assign(req.params.id, req.user.organizationId, body.agent_id);
  if (error) return handleDbError(error, logger, res, 'Failed to assign lead');

  await auditRepository.log({
    organizationId: req.user.organizationId,
    actorId: req.user.id,
    action: 'leads.assigned',
    resourceType: 'lead',
    resourceId: data.id,
    oldValue: { assigned_agent_id: old.assigned_agent_id },
    newValue: { assigned_agent_id: body.agent_id },
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
  });

  return successResponse(res, { lead: data });
});

// POST /api/leads/distribute (Batch auto-distribute unassigned leads)
router.post('/distribute', authenticate, requirePermission('leads.assign'), async (req, res) => {
  try {
    const result = await leadRouterService.batchDistribute({
      organizationId: req.user.organizationId,
      campaignId: req.body.campaign_id,
      actorId: req.user.id,
      limit: req.body.limit || 50,
    });
    return successResponse(res, result);
  } catch (err) {
    logger.error('Batch distribute leads failed', { error: err.message });
    return errorResponse(res, err.message || 'Failed to distribute leads', 400);
  }
});

// POST /api/leads/:id/route (Auto-route a single lead to best available agent)
router.post('/:id/route', authenticate, requirePermission('leads.assign'), async (req, res) => {
  try {
    const result = await leadRouterService.routeLead({
      leadId: req.params.id,
      organizationId: req.user.organizationId,
      actorId: req.user.id,
      teamId: req.body.team_id,
    });
    return successResponse(res, result);
  } catch (err) {
    logger.error('Route lead failed', { error: err.message });
    return errorResponse(res, err.message || 'Failed to route lead', 400);
  }
});

export default router;


