import express from 'express';
import { z } from 'zod';
import supabase, { isSupabaseConfigured } from '../../config/supabase.js';
import { auditRepository } from '../../repositories/auditRepository.js';
import { authenticate, requirePermission } from '../../middleware/auth.js';
import { parsePagination, successResponse, errorResponse, validateBody, handleDbError } from '../../utils/helpers.js';
import logger from '../../utils/logger.js';

const router = express.Router();

const campaignSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(2000).optional().nullable(),
  type: z.enum(['outbound', 'inbound', 'blended']).default('outbound'),
  script: z.string().optional().nullable(),
  goal: z.string().max(500).optional().nullable(),
  start_date: z.string().optional().nullable(),
  end_date: z.string().optional().nullable(),
  settings: z.record(z.unknown()).optional().default({}),
});

// GET /api/campaigns
router.get('/', authenticate, async (req, res) => {
  const { page, limit, offset } = parsePagination(req.query);
  const { status } = req.query;

  if (!isSupabaseConfigured) {
    const { demoData } = await import('../../utils/demoData.js');
    let list = [...demoData.campaigns];
    if (status) list = list.filter((c) => c.status === status);
    return successResponse(res, {
      campaigns: list,
      pagination: { page, limit, total: list.length },
    });
  }

  let query = supabase
    .from('campaigns')
    .select('id, name, type, status, goal, start_date, end_date, created_at', { count: 'exact' })
    .eq('organization_id', req.user.organizationId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (status) query = query.eq('status', status);

  try {
    const { data, error, count } = await query;
    if (error) throw error;
    return successResponse(res, {
      campaigns: data,
      pagination: { page, limit, total: count },
    });
  } catch {
    const { demoData } = await import('../../utils/demoData.js');
    let list = [...demoData.campaigns];
    if (status) list = list.filter((c) => c.status === status);
    return successResponse(res, {
      campaigns: list,
      pagination: { page, limit, total: list.length },
    });
  }
});


// GET /api/campaigns/:id
router.get('/:id', authenticate, async (req, res) => {
  if (!isSupabaseConfigured) {
    const { demoData } = await import('../../utils/demoData.js');
    const c = demoData.campaigns.find((c) => c.id === req.params.id) || demoData.campaigns[0];
    return successResponse(res, { campaign: c });
  }

  const { data, error } = await supabase
    .from('campaigns')
    .select('*')
    .eq('id', req.params.id)
    .eq('organization_id', req.user.organizationId)
    .single();

  if (error || !data) return errorResponse(res, 'Campaign not found', 404);
  return successResponse(res, { campaign: data });
});

// POST /api/campaigns
router.post('/', authenticate, requirePermission('campaigns.manage'), async (req, res) => {
  const body = validateBody(campaignSchema, req.body, res);
  if (!body) return;

  if (!isSupabaseConfigured) {
    const { demoData } = await import('../../utils/demoData.js');
    const { v4: uuidv4 } = await import('uuid');
    const newCamp = {
      id: uuidv4(),
      ...body,
      status: 'active',
      created_at: new Date().toISOString(),
    };
    demoData.campaigns.unshift(newCamp);
    return successResponse(res, { campaign: newCamp }, 201);
  }

  const { data, error } = await supabase
    .from('campaigns')
    .insert({ ...body, organization_id: req.user.organizationId, created_by: req.user.id })
    .select()
    .single();

  if (error) return handleDbError(error, logger, res, 'Failed to create campaign');

  await auditRepository.log({
    organizationId: req.user.organizationId,
    actorId: req.user.id,
    action: 'campaigns.created',
    resourceType: 'campaign',
    resourceId: data.id,
    newValue: { name: data.name },
  });

  return successResponse(res, { campaign: data }, 201);
});

// PATCH /api/campaigns/:id
router.patch('/:id', authenticate, requirePermission('campaigns.manage'), async (req, res) => {
  const body = validateBody(campaignSchema.partial().extend({
    status: z.enum(['draft', 'active', 'paused', 'completed', 'archived']).optional(),
  }), req.body, res);
  if (!body) return;

  const { data, error } = await supabase
    .from('campaigns')
    .update({ ...body, updated_at: new Date().toISOString() })
    .eq('id', req.params.id)
    .eq('organization_id', req.user.organizationId)
    .select()
    .single();

  if (error || !data) return handleDbError(error, logger, res, 'Failed to update campaign');
  return successResponse(res, { campaign: data });
});

// DELETE /api/campaigns/:id  (archive)
router.delete('/:id', authenticate, requirePermission('campaigns.manage'), async (req, res) => {
  const { data, error } = await supabase
    .from('campaigns')
    .update({ status: 'archived', updated_at: new Date().toISOString() })
    .eq('id', req.params.id)
    .eq('organization_id', req.user.organizationId)
    .select()
    .single();

  if (error || !data) return errorResponse(res, 'Campaign not found', 404);
  return successResponse(res, { campaign: data });
});

export default router;
