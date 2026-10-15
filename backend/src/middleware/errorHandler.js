import logger from '../utils/logger.js';

/**
 * Global error handler — catches any error passed to next(err).
 * Never leaks stack traces or internal messages to clients in production.
 */
export function errorHandler(err, req, res, next) {
  const status = err.status || err.statusCode || 500;
  const message = status < 500 ? err.message : 'An unexpected error occurred';

  logger.error('Unhandled error', {
    status,
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    userId: req.user?.id,
  });

  res.status(status).json({
    success: false,
    error: message,
  });
}

/**
 * 404 handler — for routes that don't match any defined endpoint.
 */
export function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    error: `Route not found: ${req.method} ${req.path}`,
  });
}
