import express from 'express';
import { articlesRepository } from '../repositories/article.repository.js';
import { commentRouter } from './comment_route.js';
import { validateArticle } from '../middlewares/article-validate.js';
import {
  createArticleSchema,
  updateArticleSchema,
} from '../schema/article.schema.js';

export const articleRouter = express.Router();

articleRouter.get('/:articleId', validateArticle, async (req, res, next) => {
  try {
    const articleId = req.params.articleId;
    const article = await articlesRepository.findById(articleId);
    res.status(200).json({
      success: true,
      data: article,
      message: '게시글을 찾았습니다.',
    });
  } catch (error) {
    next(error);
  }
});

articleRouter.get('/', async (req, res, next) => {
  try {
    const { orderBy, keyword } = req.query;

    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);
    if (
      !Number.isSafeInteger(page) ||
      !Number.isSafeInteger(limit) ||
      page < 1 ||
      limit < 1 ||
      limit > 100
    ) {
      return res.status(400).json({
        message: 'page는 양의 정수, limit은 1~100의 정수여야 합니다.',
      });
    }

    if (keyword !== undefined && typeof keyword !== 'string') {
      return res.status(400).json({
        message: '검색 키워드는 문자열이여야 합니다.',
      });
    }
    const articles = await articlesRepository.findAll(
      page,
      limit,
      orderBy,
      keyword,
    );

    res.status(200).json({
      success: true,
      data: articles,
      count: articles.length,
      message: '게시글을 찾았습니다.',
    });
  } catch (error) {
    next(error);
  }
});

articleRouter.post('/', async (req, res, next) => {
  try {
    const data = createArticleSchema.parse(req.body);

    const newArticle = await articlesRepository.create(data);
    res.status(200).json({
      success: true,
      data: newArticle,
      message: '게시글 생성에 성공했습니다',
    });
  } catch (error) {
    next(error);
  }
});

articleRouter.patch('/:articleId', validateArticle, async (req, res, next) => {
  try {
    const articleId = req.params.articleId;
    const data = updateArticleSchema.parse(req.body);
    const updateArticle = await articlesRepository.update(articleId, data);
    res.status(200).json({
      success: true,
      data: updateArticle,
      message: '게시글 수정에 성공했습니다',
    });
  } catch (error) {
    next(error);
  }
});

articleRouter.delete('/:articleId', validateArticle, async (req, res, next) => {
  try {
    const articleId = req.params.articleId;
    const deleteArticle = await articlesRepository.remove(articleId);
    res.status(200).json({
      success: true,
      data: deleteArticle,
      message: '게시글 삭제에 성공했습니다',
    });
  } catch (error) {
    next(error);
  }
});

articleRouter.use('/:articleId/comments', commentRouter);
