import express from 'express';
import { z } from 'zod';
import { articleRepository, commentRepository } from '#repositories';
import { HTTP_STATUS } from '#constants';
import {
  validateArticlePatchBody,
  validateArticlePostBody,
  validateCommentPagination,
  validatePagination,
} from '#middlewares';
import { validateCommentBody } from '../middlewares/validate-comment.middleware.js';
import { BadRequestException } from '#errors';

export const articleRouter = express.Router();

articleRouter.param('articleId', (req, res, next, value) => {
  try {
    req.articleId = z.coerce.number().int().positive().parse(value);
    return next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new BadRequestException('게시글 id가 올바르지 않습니다.'));
    }
    return next(error);
  }
});

articleRouter.post('/', validateArticlePostBody, async (req, res) => {
  const { title, content } = req.body ?? {};
  const article = await articleRepository.create({ title, content });
  return res.status(HTTP_STATUS.CREATED).json({ success: true, data: article });
});

articleRouter.get('/', validatePagination, async (req, res) => {
  const { offset, limit, keyword } = req.validatedQuery ?? {};
  const { list, totalCount } = await articleRepository.findAll({
    offset,
    limit,
    keyword,
  });
  return res
    .status(HTTP_STATUS.OK)
    .json({ success: true, data: list, totalCount });
});

articleRouter.patch(
  '/:articleId',
  validateArticlePatchBody,
  async (req, res) => {
    const articleId = req.articleId;
    const { title, content } = req.body ?? {};
    const article = await articleRepository.update(articleId, {
      title,
      content,
    });
    return res.status(HTTP_STATUS.OK).json({ success: true, data: article });
  },
);

articleRouter.delete('/:articleId', async (req, res) => {
  const articleId = req.articleId;
  await articleRepository.remove(articleId);
  return res.status(HTTP_STATUS.NO_CONTENT).send();
});

articleRouter.post(
  '/:articleId/comments',
  validateCommentBody,
  async (req, res) => {
    const articleId = req.articleId;
    const { content } = req.body ?? {};
    const comment = await commentRepository.create({ content, articleId });
    return res
      .status(HTTP_STATUS.CREATED)
      .json({ success: true, data: comment });
  },
);

articleRouter.get(
  '/:articleId/comments',
  validateCommentPagination,
  async (req, res) => {
    const articleId = req.articleId;
    const { cursor, limit } = req.validatedQuery ?? {};
    const { list, nextCursor } = await commentRepository.findAllByParent({
      articleId,
      cursor,
      limit,
    });
    return res
      .status(HTTP_STATUS.OK)
      .json({ success: true, data: list, nextCursor });
  },
);
