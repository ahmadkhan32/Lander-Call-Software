import express from 'express';
import { z } from 'zod';
import supabase, { isSupabaseConfigured } from '../../config/supabase.js';
import { authenticate, requirePermission } from '../../middleware/auth.js';
import { parsePagination, successResponse, errorResponse, validateBody, handleDbError } from '../../utils/helpers.js';
import logger from '../../utils/logger.js';

const router = express.Router();

const followUpSchema = z.object({
  lead_id: z.string().uuid(),
  type: z.enum(['callback', 'email', 'meeting', 'task', 'other']).default('callback'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  due_at: z.string().datetime(),
  notes: z.string().max(5000).optional().nullable(),
  call_id: z.string().uuid().optional().nullable(),
  assigned_agent_id: z.string().uuid().optional().nullable(),
});

// GET /api/follow-ups
router.get('/', authenticate, requirePermission('leads.read'), async (req, res) => {
  const { page, limit, offset } = parsePagination(req.query);
  const { status, assigned_agent_id, overdue } = req.query;

  if (!isSupabaseConfigured) {
    const { demoData } = await import('../../utils/demoData.js');
    let list = [...demoData.followUps];
    if (status) list = list.filter((f) => f.status === status);
    if (overdue === 'true') {
      list = list.filter((f) => f.status === 'pending' && new Date(f.due_at) < new Date());
    }
    return successResponse(res, { followUps: list, pagination: { page, limit, total: list.length } });
  }

  let query = supabase
    .from('follow_ups')
    .select(`
      id, type, status, priority, due_at, notes, completed_at, created_at,
      leads:lead_id ( id, full_name, phone ),
      profiles:assigned_agent_id ( id, full_name )
    `, { count: 'exact' })
    .eq('organization_id', req.user.organizationId)
    .order('due_at', { ascending: true })
    .range(offset, offset + limit - 1);

  if (status) query = query.eq('status', status);
  if (assigned_agent_id) query = query.eq('assigned_agent_id', assigned_agent_id);
  if (overdue === 'true') {
    query = query.lt('due_at', new Date().toISOString()).eq('status', 'pending');
  }

  try {
    const { data, error, count } = await query;
    if (error) throw error;
    return successResponse(res, { followUps: data, pagination: { page, limit, total: count } });
  } catch {
    const { demoData } = await import('../../utils/demoData.js');
    let list = [...demoData.followUps];
    if (status) list = list.filter((f) => f.status === status);
    if (overdue === 'true') {
      list = list.filter((f) => f.status === 'pending' && new Date(f.due_at) < new Date());
    }
    return successResponse(res, { followUps: list, pagination: { page, limit, total: list.length } });
  }
});


// POST /api/follow-ups
router.post('/', authenticate, requirePermission('follow_ups.manage'), async (req, res) => {
  const body = validateBody(followUpSchema, req.body, res);
  if (!body) return;

  if (!isSupabaseConfigured) {
    const { demoData } = await import('../../utils/demoData.js');
    const { v4: uuidv4 } = await import('uuid');
    const newFollowUp = {
      id: uuidv4(),
      ...body,
      status: 'pending',
      created_at: new Date().toISOString(),
      leads: { id: body.lead_id, full_name: 'Lead Contact', phone: '+1-555-0100' },
      profiles: { id: req.user.id, full_name: req.user.fullName || 'Super Administrator' },
    };
    demoData.followUps.unshift(newFollowUp);
    return successResponse(res, { followUp: newFollowUp }, 201);
  }

  // Verify lead belongs to same org
  const { data: lead } = await supabase
    .from('leads')
    .select('id')
    .eq('id', body.lead_id)
    .eq('organization_id', req.user.organizationId)
    .single();

  if (!lead) return errorResponse(res, 'Lead not found in your organization', 404);

  const { data, error } = await supabase
    .from('follow_ups')
    .insert({
      ...body,
      organization_id: req.user.organizationId,
      created_by: req.user.id,
    })
    .select()
    .single();

  if (error) return handleDbError(error, logger, res, 'Failed to create follow-up');
  return successResponse(res, { followUp: data }, 201);
});

// PATCH /api/follow-ups/:id
router.patch('/:id', authenticate, requirePermission('follow_ups.manage'), async (req, res) => {
  const schema = followUpSchema.partial().extend({
    status: z.enum(['pending', 'completed', 'cancelled', 'overdue']).optional(),
    completed_at: z.string().datetime().optional().nullable(),
  });
  const body = validateBody(schema, req.body, res);
  if (!body) return;

  const completedAt = body.status === 'completed' && !body.completed_at
    ? new Date().toISOString()
    : body.completed_at;

  const { data, error } = await supabase
    .from('follow_ups')
    .update({ ...body, completed_at: completedAt, updated_at: new Date().toISOString() })
    .eq('id', req.params.id)
    .eq('organization_id', req.user.organizationId)
    .select()
    .single();

  if (error || !data) return errorResponse(res, 'Follow-up not found', 404);
  return successResponse(res, { followUp: data });
});

// DELETE /api/follow-ups/:id (cancel)
router.delete('/:id', authenticate, requirePermission('follow_ups.manage'), async (req, res) => {
  const { data, error } = await supabase
    .from('follow_ups')
    .update({ status: 'cancelled', updated_at: new Date().toISOString() })
    .eq('id', req.params.id)
    .eq('organization_id', req.user.organizationId)
    .select()
    .single();

  if (error || !data) return errorResponse(res, 'Follow-up not found', 404);
  return successResponse(res, { followUp: data });
});

export default router;
