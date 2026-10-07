import * as articleController from '#src/controllers/article.controller.js';
import {
  validateBody,
  validateParams,
  validateQuery,
} from '#src/middlewares/validate.middleware.js';
import {
  createArticleSchema,
  getArticleParamsSchema,
  getArticlesQuerySchema,
  updateArticleSchema,
} from '#src/validations/article.validate.js';
import { Router } from 'express';

export const articleRoute = Router();

// 게시글 생성
articleRoute.post(
  '/',
  validateBody(createArticleSchema),
  articleController.createArticle,
);

// 게시글 조회
articleRoute.get(
  '/:id',
  validateParams(getArticleParamsSchema),
  articleController.getArticle,
);

// 게시글 수정
articleRoute.patch(
  '/:id',
  validateParams(getArticleParamsSchema),
  validateBody(updateArticleSchema),
  articleController.updateArticle,
);

// 게시글 삭제
articleRoute.delete(
  '/:id',
  validateParams(getArticleParamsSchema),
  articleController.deleteArticle,
);

// 게시글 목록 조회
articleRoute.get(
  '/',
  validateQuery(getArticlesQuerySchema),
  articleController.getArticles,
);
