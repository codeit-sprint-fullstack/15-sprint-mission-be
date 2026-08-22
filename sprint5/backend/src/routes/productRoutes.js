import express from 'express';
import {
  createProduct,
  getProductList,
  getProductDetail,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';

const router = express.Router();

router.route('/').post(createProduct).get(getProductList);

router
  .route('/:id')
  .get(getProductDetail)
  .patch(updateProduct)
  .delete(deleteProduct);

export default router;