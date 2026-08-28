import express from 'express';
import { NotFoundException } from '../errors/not-found-exception.js';
import { validateProduct } from '../middlewares/validate-product.js';
import { productsRepository } from '#repositories';

export const productsRouter = express.Router();

productsRouter.get('/', async (req, res, next) => {
  try {
    const { keyword, sort } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    let sortMap = 'desc';
    if (sort === null || sort === 'recent') {
      sortMap = 'desc';
    } else {
      sortMap = sort;
    }

    const [products, totalCount] = await Promise.all([
      productsRepository.find(page, limit, sortMap, keyword),
      productsRepository.count(keyword),
    ]);
    res.status(200).json({
      success: true,
      data: products,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      totalCount,
      message: '제품목록 불러오기 완료',
    });
  } catch (error) {
    next(error);
  }
});

productsRouter.get('/:productId', async (req, res, next) => {
  try {
    const product = await productsRepository.findById(req.params.productId);
    if (!product) {
      throw new NotFoundException('제품을 찾을수 없음');
    }

    res.status(200).json({
      success: true,
      data: product,
      message: '제품을 찾았습니다.',
    });
  } catch (error) {
    next(error);
  }
});

productsRouter.post('/', validateProduct, async (req, res, next) => {
  try {
    const { name, description, price, tags, img } = req.body ?? {};

    const newProduct = { name, description, price: Number(price), tags, img };
    console.log('생성데이터:',newProduct);
    const result = await productsRepository.createProduct(newProduct);

    res.status(201).json({
      success: true,
      data: result,
      message: '제품 생성 완료',
    });
  } catch (error) {
    next(error);
  }
});

productsRouter.patch('/:productId', validateProduct, async (req, res, next) => {
  try {
    const productId = req.params.productId;
    const { name, description, price, tags, img } = req.body ?? {};
    const target = productsRepository.findById(productId);
    if (!target) {
      throw new NotFoundException('제품을 찾을 수 없음');
    }

    const update = {};
    if (name) {
      update.name = name;
    }
    if (description) {
      update.description = description;
    }
    if (price) {
      update.price = price;
    }
    if (tags) {
      update.tags = tags;
    }
    if (img) {
      update.img = img;
    }

    const udpatedProduct = await productsRepository.update(productId, update);

    res.status(200).json({
      success: true,
      data: udpatedProduct,
      message: '제품 업데이트가 완료',
    });
  } catch (error) {
    next(error);
  }
});

productsRouter.delete('/:productId', async (req, res, next) => {
  try {
    const { productId } = req.params;
    const target = productsRepository.findById(productId);
    if (!target) {
      throw new NotFoundException('제품을 찾을 수 없음');
    }

    const deleteTarget = await productsRepository.remove(productId);

    res.status(200).json({
      success: true,
      data: deleteTarget,
      message: '제품 삭제 완료',
    });
  } catch (error) {
    next(error);
  }
});
