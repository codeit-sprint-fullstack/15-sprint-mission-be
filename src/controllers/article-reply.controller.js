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

export const updateReply = async (req, res) => {
  const { id } = req.validated.params;
  const { content } = req.validated.body;

  const updatedReply = await articleReplyService.updateReplyService({
    id,
    content,
  });

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: updatedReply,
    message: '댓글이 성공적으로 수정되었습니다.',
  });
};

export const deleteReply = async (req, res) => {
  const { id } = req.validated.params;

  const deletedReply = await articleReplyService.deleteReplyService(id);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: deletedReply,
    message: '댓글이 성공적으로 삭제되었습니다.',
  });
};
