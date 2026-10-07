import { HTTP_STATUS } from '#constants';
import { commentRepository } from '#repositories';
import express from 'express';
import { validateCommentBody } from '../middlewares/validate-comment.middleware.js';
import { z } from 'zod';
import { BadRequestException } from '#errors';

export const commentRouter = express.Router();

commentRouter.param('commentId', (req, res, next, value) => {
  try {
    req.commentId = z.coerce.number().int().positive().parse(value);
    return next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new BadRequestException('댓글 id가 올바르지 않습니다.'));
    }
    return next(error);
  }
});

commentRouter.patch('/:commentId', validateCommentBody, async (req, res) => {
  const commentId = req.commentId;
  const data = req.body ?? {};
  const comment = await commentRepository.update(commentId, data);

  return res.status(HTTP_STATUS.OK).json({ success: true, data: comment });
});

commentRouter.delete('/:commentId', async (req, res) => {
  const commentId = req.commentId;
  await commentRepository.remove(commentId);
  return res.status(HTTP_STATUS.NO_CONTENT).send();
});
