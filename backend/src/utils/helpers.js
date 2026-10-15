import { z } from 'zod';

/**
 * Parse pagination query params with defaults and limits.
 */
export function parsePagination(query) {
  const page = Math.max(1, parseInt(query.page || '1', 10));
  const limit = Math.min(100, Math.max(1, parseInt(query.limit || '20', 10)));
  const offset = (page - 1) * limit;
  return { page, limit, offset };
}

/**
 * Strip undefined values from an object (useful before DB inserts/updates).
 */
export function stripUndefined(obj) {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined));
}

/**
 * Build a standard success response.
 */
export function successResponse(res, data, status = 200) {
  return res.status(status).json({ success: true, ...data });
}

/**
 * Build a standard error response (no internal details to client).
 */
export function errorResponse(res, message, status = 500) {
  return res.status(status).json({ success: false, error: message });
}

/**
 * Validate a Zod schema and return validated data or throw 400.
 */
export function validateBody(schema, body, res) {
  const result = schema.safeParse(body);
  if (!result.success) {
    errorResponse(
      res,
      result.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join('; '),
      400
    );
    return null;
  }
  return result.data;
}

/**
 * Supabase error handler — logs internally, returns safe message.
 */
export function handleDbError(error, logger, res, message = 'Database error') {
  logger.error(message, { error: error?.message, code: error?.code });
  return errorResponse(res, message, 500);
}
