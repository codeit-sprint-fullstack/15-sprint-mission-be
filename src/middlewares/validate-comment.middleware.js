import { BadRequestException } from '#errors';
import { z } from 'zod';

const commentSchema = z.object({
  content: z.string().min(1).max(200),
});

export const validateCommentBody = (req, res, next) => {
  try {
    req.body = commentSchema.parse(req.body ?? {});
    return next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new BadRequestException('요청 본문이 올바르지 않습니다.'));
    }
    return next(error);
  }
};
