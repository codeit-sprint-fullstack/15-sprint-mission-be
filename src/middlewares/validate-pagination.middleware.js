import { BadRequestException } from '#errors';
import { z } from 'zod';

const paginationSchema = z.object({
  offset: z.coerce.number().int().min(0).default(0),
  limit: z.coerce.number().int().min(1).max(10).default(10),
  keyword: z.string().max(10).optional(),
});

export const validatePagination = (req, res, next) => {
  try {
    req.validatedQuery = paginationSchema.parse(req.query);
    return next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new BadRequestException('페이지네이션 요청값이 올바르지 않습니다.'));
    }
    return next(error);
  }
};

const commentPaginationSchema = z.object({
  cursor: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().min(1).max(10).default(10),
});

export const validateCommentPagination = (req, res, next) => {
  try {
    req.validatedQuery = commentPaginationSchema.parse(req.query);
    return next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new BadRequestException('페이지네이션 요청값이 올바르지 않습니다.'));
    }
    return next(error);
  }
};
