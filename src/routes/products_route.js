import express from 'express';
import { Product } from '../models/product.model.js';
import { BadRequestException } from '../errors/bad-request-exception.js';
import { NotFoundException } from '../errors/not-found-exception.js';

export const productRouter = express.Router();

// get
// {list : [], totalCount : Number}
productRouter.get('/', async (req, res, next) => {
  try {
    const page = Number(req.query.page ?? 1);
    const pageSize = Number(req.query.pageSize ?? 10);
    const orderBy = req.query.orderBy ?? 'recent';
    const keyword = req.query.keyword ?? '';

    if (page <= 0) {
      throw new BadRequestException('page는 1이상 이여야 합니다');
    }

    if (pageSize <= 0) {
      throw new BadRequestException('pageSize는 1 이상이여야 합니다');
    }

    if (!['recent', 'favorite'].includes(orderBy)) {
      throw new BadRequestException(
        'standard는 recent 혹은 favorite 이여야 합니다',
      );
    }

    if (keyword.length >= 25) {
      throw new BadRequestException('keyword는 24자 이하여야 합니다');
    }

    const filter = keyword ? { name: { $regex: keyword, $options: 'i' } } : {};

    const sortOption = orderBy === 'recent' ? { createdAt: -1 } : {};
    const list = await Product.find(filter)
      .sort(sortOption)
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    const totalCount = await Product.countDocuments(filter);

    res.status(200).json({
      list,
      totalCount,
    });
  } catch (error) {
    return next(error);
  }
});

productRouter.post('/', async (req, res, next) => {
  try {
    const { name, description, price, tags } = req.body ?? {};
    // 값이 다 비어있는 경우 - 400
    if (!name && !description && !price && !tags) {
      throw new BadRequestException('입력란에 하나 이상 입력해주세요');
    }

    const newProduct = new Product({ name, description, price, tags });
    await newProduct.save();

    res.status(201).json({
      product: newProduct,
    });
  } catch (error) {
    return next(error);
  }
});

productRouter.patch('/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params;
    const target = await Product.findOne({ _id: userId });
    if (!target) {
      throw new NotFoundException('상품을 찾을 수 없습니다');
    }

    const { name, description, price, tags } = req.body ?? {};
    if (!name && !description && !price && !tags) {
      throw new BadRequestException('입력란에 하나 이상 입력해주세요');
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

    const updateProduct = await Product.findByIdAndUpdate(userId, update, {
      returnDocument: 'after',
      runValidators: true,
    });

    res.status(200).json({
      product: updateProduct,
    });
  } catch (error) {
    return next(error);
  }
});

productRouter.delete('/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params;
    const deleteProduct = await Product.findByIdAndDelete(userId);

    if (!deleteProduct) {
      throw new NotFoundException('상품을 찾을 수 없습니다.');
    }

    res.status(200).json({
      product: deleteProduct,
    });
  } catch (error) {
    return next(error);
  }
});
