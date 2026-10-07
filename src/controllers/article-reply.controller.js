import { HTTP_STATUS } from '#src/constants/index.js';
import * as articleReplyService from '#src/services/article-reply.service.js';

export const createReply = async (req, res) => {
  const { articleId, content } = req.validated.body;

  const newReply = await articleReplyService.createReplyService({
    articleId,
    content,
  });

  res.status(HTTP_STATUS.CREATE).json({
    success: true,
    data: newReply,
    message: '댓글이 등록되었습니다.',
  });
};

export const updateReply = async (req, res) => {};
