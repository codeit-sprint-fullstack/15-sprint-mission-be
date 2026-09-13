import { z } from 'zod';
import { BadRequestException } from '../errors/bad-request-exception.js';

const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const productPaginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
  keyword: z.string().max(20).optional().transform((val) => (val ? escapeRegex(val) : val)),
});

export const validateProductPagination = (req, res, next) => {
  try {
    req.validatedPagination = productPaginationSchema.parse(req.query);
    return next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(
        new BadRequestException(
          '페이지 크기는 최대 100, 키워드는 최대 20자입니다.', // 오류 메세지는 사용자가 일반적으로 실수할 수 있는 범위 내에서 작성하였습니다.
        ),
      );
    }
    return next(error);
  }
};
