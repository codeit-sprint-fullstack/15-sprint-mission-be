import express from 'express';
import { ERROR_MESSAGES, HTTP_STATUS } from '#constants';
import { BadRequestException } from '#errors';
import { commentRepository } from '#repositories';
import { parseIdParam } from './query-parsers.js';

export const commentsRouter = express.Router();

commentsRouter.patch('/:commentId', async (req, res) => {
  const commentId = parseIdParam(req.params.commentId);
  const { content } = req.body ?? {};

  if (!content) {
    throw new BadRequestException(ERROR_MESSAGES.UPDATE_COMMENT_REQUIRED);
  }

  const comment = await commentRepository.update(commentId, { content });

  return res.status(HTTP_STATUS.OK).json({ success: true, data: comment });
});

commentsRouter.delete('/:commentId', async (req, res) => {
  const commentId = parseIdParam(req.params.commentId);

  await commentRepository.remove(commentId);

  return res.sendStatus(HTTP_STATUS.NO_CONTENT);
});
