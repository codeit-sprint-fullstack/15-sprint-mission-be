import { BadRequestException } from '#src/errors/bad-request-exception.js';

export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse({
    body: req.body,
    query: req.query,
    params: req.params,
  });

  if (!result.success) {
    const issue = result.error.issues[0];
    throw new BadRequestException(issue.message);
  }

  if (result.data.body) req.body = result.data.body;
  if (result.data.params) req.params = result.data.params;

  if (result.data.query) {
    Object.keys(req.query).forEach((key) => delete req.query[key]);
    Object.assign(req.query, result.data.query);
  }

  next();
};
