import expressd from 'express';
import { productRepository } from '../repositories/product.repository.js';
import { commentRouter } from './comment_route.js';
import { validateProduct } from '../middlewares/product-validate.js';
import {
  createProductSchema,
  updateProductSchema,
} from '../schema/product.schema.js';

export const productRouter = expressd.Router();

productRouter.get('/:productId', validateProduct, async (req, res, next) => {
  try {
    const productId = req.params.productId;
    const product = await productRepository.findById(productId);

    res.status(200).json({
      success: true,
      data: product,
      message: '상품을 찾았습니다.',
    });
  } catch (error) {
    next(error);
  }
});

productRouter.get('/', async (req, res, next) => {
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
        message: 'keyword는 문자열이여야 합니다.',
      });
    }

    const products = await productRepository.findAll(
      page,
      limit,
      orderBy,
      keyword,
    );

    res.status(200).json({
      success: true,
      data: products,
      count: products.length,
      message: '상품을 찾았습니다.',
    });
  } catch (error) {
    next(error);
  }
});

productRouter.post('/', async (req, res, next) => {
  try {
    const data = createProductSchema.parse(req.body); // 나중에 검증 하는 거 zod 에 넣어야 함

    const newProduct = await productRepository.create(data);
    res.status(200).json({
      success: true,
      data: newProduct,
      message: '상품 등록에 성공했습니다.',
    });
  } catch (error) {
    next(error);
  }
});

productRouter.patch('/:productId', validateProduct, async (req, res, next) => {
  try {
    const productId = req.params.productId;
    if (!productId) {
      res.status(404).json({
        success: false,
        message: '상품 아이디를 찾을 수 없습니다.',
      });
    }
    const data = updateProductSchema.parse(req.body);
    const updateData = await productRepository.update(productId, data);
    if (!updateData) {
      res.status(404).json({
        success: false,
        message: '상품을 찾을 수 없습니다.',
      });
    }
    res.status(200).json({
      success: true,
      message: '상품 수정에 성공했습니다.',
    });
  } catch (error) {
    next(error);
  }
});

productRouter.delete('/:productId', validateProduct, async (req, res, next) => {
  try {
    const productId = req.params.productId;
    if (!productId) {
      res.status(404).json({
        success: false,
        message: '상품 아이디를 찾을 수 없습니다.',
      });
    }

    const deleteProduct = await productRepository.remove(productId);
    res.status(200).json({
      success: true,
      message: '상품 삭제에 성공했습니다.',
    });
  } catch (error) {
    next(error);
  }
});

productRouter.use('/:productId/comments', commentRouter);
