/**
 * Global error handler middleware
 */
function errorHandler(err, req, res, next) {
  console.error('[Error]', err);

  // Prisma errors
  if (err.code === 'P2002') {
    return res.status(409).json({ error: 'Conflict: Duplicate entry', field: err.meta?.target });
  }
  if (err.code === 'P2025') {
    return res.status(404).json({ error: 'Not found' });
  }
  if (err.code === 'P2003') {
    return res.status(400).json({ error: 'Invalid reference: Related record not found' });
  }

  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal server error';
  res.status(status).json({ error: message });
}

/**
 * Async wrapper - catches async errors and passes to errorHandler
 */
function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

module.exports = { errorHandler, asyncHandler };
