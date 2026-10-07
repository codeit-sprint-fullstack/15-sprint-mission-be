import { BadRequestException } from '#errors';
import { z } from 'zod';

const articlePostSchema = z.object({
  title: z.string().min(1).max(30),
  content: z.string().min(10).max(500),
});

export const validateArticlePostBody = (req, res, next) => {
  try {
    req.body = articlePostSchema.parse(req.body ?? {});
    return next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new BadRequestException('요청 본문이 올바르지 않습니다.'));
    }
    return next(error);
  }
};

const articlePatchSchema = z
  .object({
    title: z.string().min(1).max(30).optional(),
    content: z.string().min(10).max(500).optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: '수정할 값이 필요합니다.',
  });

export const validateArticlePatchBody = (req, res, next) => {
  try {
    req.body = articlePatchSchema.parse(req.body ?? {});
    return next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new BadRequestException('요청 본문이 올바르지 않습니다.'));
    }
    return next(error);
  }
};
