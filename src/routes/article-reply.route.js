import * as articleReplyController from '#src/controllers/article-reply.controller.js';
import {
  validateBody,
  validateParams,
  validateQuery,
} from '#src/middlewares/validate.middleware.js';
import {
  createReplySchema,
  getRepliesQuerySchema,
  getReplyParamsSchema,
  updateReplySchema,
} from '#src/validations/article-reply.validate.js';
import { Router } from 'express';

export const articleReplyRoute = Router();

// 댓글 등록
articleReplyRoute.post(
  '/',
  validateBody(createReplySchema),
  articleReplyController.createReply,
);

// 댓글 수정
articleReplyRoute.patch(
  '/:id',
  validateParams(getReplyParamsSchema),
  validateBody(updateReplySchema),
  articleReplyController.updateReply,
);

// 댓글 삭제
articleReplyRoute.delete(
  '/:id',
  validateParams(getReplyParamsSchema),
  articleReplyController.deleteReply,
);

// 댓글 목록 조회
articleReplyRoute.get(
  '/',
  validateQuery(getRepliesQuerySchema),
  articleReplyController.getRelies,
);
