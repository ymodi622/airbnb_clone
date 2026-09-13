'use strict';

/**
 * Returns an Express middleware that validates req.params / req.query / req.body
 * against the provided Zod schemas. Pass null to skip any section.
 *
 * Usage:
 *   router.get('/:id', validate({ params: paramsSchema }), controller);
 *   router.post('/', validate({ body: bodySchema }), controller);
 */
function validate({ params, query, body } = {}) {
  return (req, res, next) => {
    try {
      if (params) {
        const result = params.safeParse(req.params);
        if (!result.success) {
          const err = new Error(result.error.errors.map((e) => e.message).join(', '));
          err.statusCode = 400;
          return next(err);
        }
        req.params = result.data;
      }

      if (query) {
        const result = query.safeParse(req.query);
        if (!result.success) {
          const err = new Error(result.error.errors.map((e) => e.message).join(', '));
          err.statusCode = 400;
          return next(err);
        }
        req.query = result.data;
      }

      if (body) {
        const result = body.safeParse(req.body);
        if (!result.success) {
          const err = new Error(result.error.errors.map((e) => e.message).join(', '));
          err.statusCode = 400;
          return next(err);
        }
        req.body = result.data;
      }

      next();
    } catch (err) {
      next(err);
    }
  };
}

module.exports = validate;
