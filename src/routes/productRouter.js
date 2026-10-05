import express from 'express';
import * as productController from '#src/controllers/productController.js';
import * as commentController from '#src/controllers/commentController.js';
import { validate } from '#src/validators/validate.js';
import {
  productIdSchema,
  createProductSchema,
  updateProductSchema,
  getProductsSchema,
} from '../validators/productValidator.js';

import {
  createCommentSchema,
  updateCommentSchema,
  getCommentsSchema,
  commentIdSchema,
} from '#src/validators/commentValidator.js';

const productRouter = express.Router();

productRouter.post(
  '/',
  validate(createProductSchema),
  productController.createProduct,
);

productRouter.get(
  '/',
  validate(getProductsSchema),
  productController.getProducts,
);

productRouter.get(
  '/:id',
  validate(productIdSchema),
  productController.getProductById,
);

productRouter.patch(
  '/:id',
  validate(productIdSchema),
  validate(updateProductSchema),
  productController.updateProduct,
);

productRouter.delete(
  '/:id',
  validate(productIdSchema),
  productController.deleteProduct,
);

productRouter.post(
  '/:productId/comments',
  validate(createCommentSchema),
  commentController.createProductComment,
);

productRouter.get(
  '/:productId/comments',
  validate(getCommentsSchema),
  commentController.getProductComments,
);

productRouter.patch(
  '/comments/:id',
  validate(commentIdSchema),
  validate(updateCommentSchema),
  commentController.updateProductComment,
);

productRouter.delete(
  '/comments/:id',
  validate(commentIdSchema),
  commentController.deleteProductComment,
);

export default productRouter;
