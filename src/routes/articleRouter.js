import { Router } from 'express';
import * as articleController from '#src/controllers/articleController.js';
import * as commentController from '#src/controllers/commentController.js';
import { validate } from '#src/validators/validate.js';
import {
  createArticleSchema,
  updateArticleSchema,
  getArticlesSchema,
  getArticleByIdSchema,
} from '#src/validators/articleValidator.js';

import {
  createCommentSchema,
  updateCommentSchema,
  getCommentsSchema,
  commentIdSchema,
} from '#src/validators/commentValidator.js';

const articleRouter = Router();

articleRouter.post(
  '/',
  validate(createArticleSchema),
  articleController.createArticle,
);

articleRouter.get(
  '/',
  validate(getArticlesSchema),
  articleController.getArticles,
);

articleRouter.get(
  '/:id',
  validate(getArticleByIdSchema),
  articleController.getArticleById,
);

articleRouter.patch(
  '/:id',
  validate(updateArticleSchema),
  articleController.updateArticle,
);

articleRouter.delete(
  '/:id',
  validate(getArticleByIdSchema),
  articleController.deleteArticle,
);

articleRouter.post(
  '/:articleId/comments',
  validate(createCommentSchema),
  commentController.createArticleComment,
);

articleRouter.get(
  '/:articleId/comments',
  validate(getCommentsSchema),
  commentController.getArticleComments,
);

articleRouter.patch(
  '/comments/:id',
  validate(commentIdSchema),
  validate(updateCommentSchema),
  commentController.updateArticleComment,
);

articleRouter.delete(
  '/comments/:id',
  validate(commentIdSchema),
  commentController.deleteArticleComment,
);
export default articleRouter;
