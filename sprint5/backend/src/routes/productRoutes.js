const express = require('express');
const {
  createProduct,
  getProductList,
  getProductDetail,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');

const router = express.Router();

router.route('/').post(createProduct).get(getProductList);

router
  .route('/:id')
  .get(getProductDetail)
  .patch(updateProduct)
  .delete(deleteProduct);

module.exports = router;
