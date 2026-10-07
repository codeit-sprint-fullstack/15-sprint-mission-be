import * as articleController from '#src/controllers/article.controller.js';
import { validateBody } from '#src/middlewares/validate.middleware.js';
import { createArticleSchema } from '#src/validations/article.validate.js';
import { Router } from 'express';

export const articleRoute = Router();

articleRoute.post(
  '/',
  validateBody(createArticleSchema),
  articleController.createArticle,
);
