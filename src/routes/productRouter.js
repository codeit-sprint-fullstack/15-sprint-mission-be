import express from 'express';
import * as productController from '#src/controllers/productController.js';
import { validate } from '#src/validators/validate.js';
import {
  productIdSchema,
  createProductSchema,
  updateProductSchema,
  getProductsSchema,
} from '../validators/productValidator.js';

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

export default productRouter;
