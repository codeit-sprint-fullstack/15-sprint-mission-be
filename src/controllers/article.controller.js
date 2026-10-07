import * as articleService from '#src/services/article.service.js';
import { HTTP_STATUS } from '../constants/index.js';

export const createArticle = async (req, res) => {
  const { title, content } = req.validated.body;

  const newArticle = await articleService.createArticleService({
    title,
    content,
  });

  res.status(HTTP_STATUS.CREATE).json({
    success: true,
    data: newArticle,
    message: '게시글이 생성되었습니다.',
  });
};
