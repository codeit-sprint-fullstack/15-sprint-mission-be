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

export const getArticle = async (req, res) => {
  const { id } = req.validated.params;

  const article = await articleService.getArticleByIdService(id);

  return res.status(HTTP_STATUS.OK).json({
    success: true,
    data: article,
    message: '게시글 조회에 성공했습니다.',
  });
};

export const updateArticle = async (req, res) => {
  const { id } = req.validated.params;
  const { title, content } = req.validated.body;

  const updatedArticle = await articleService.updateArticleById({
    id,
    title,
    content,
  });

  return res.status(HTTP_STATUS.OK).json({
    success: true,
    data: updatedArticle,
    message: '게시글 수정에 성공했습니다.',
  });
};

export const deleteArticle = async (req, res) => {
  const { id } = req.validated.params;
  const deletedArticle = await articleService.deleteArticleById(id);

  return res.status(HTTP_STATUS.OK).json({
    success: true,
    data: deletedArticle,
    message: '게시글 삭제에 성공했습니다.',
  });
};
