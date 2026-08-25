import express from 'express';
import { NotFoundException } from '../errors/not-found-exception.js';
import { Product } from '../models/product.model.js';

export const productsRouter = express.Router();

productsRouter.post('/', async (req, res) => {
  const { name, description, price, tags } = req.body;

  const product = await Product.create({ name, description, price, tags });

  res.status(201).json(product);
});

productsRouter.get('/', async (req, res) => {
  const { offset = 0, limit = 10, sort = 'recent', keyword = '' } = req.query;

  const parsedOffset = Number(offset);
  const parsedLimit = Number(limit);

  const sortOption = sort === 'recent' ? { createdAt: -1 } : { createdAt: -1 };

  const query = keyword
    ? {
        $or: [
          { name: { $regex: keyword, $options: 'i' } },
          { description: { $regex: keyword, $options: 'i' } },
        ],
      }
    : {};

  const [products, totalCount] = await Promise.all([
    Product.find(query)
      .select('id name price createdAt')
      .sort(sortOption)
      .skip(parsedOffset)
      .limit(parsedLimit),
    Product.countDocuments(query),
  ]);

  res.status(200).json({
    list: products,
    totalCount,
  });
});

productsRouter.get('/:id', async (req, res) => {
  const { id } = req.params;

  const product = await Product.findById(id).select(
    'id name description price tags createdAt'
  );

  if (!product) {
    throw new NotFoundException('해당 id의 상품을 찾을 수 없습니다.');
  }

  res.status(200).json(product);
});

productsRouter.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, price, tags } = req.body;

  const product = await Product.findByIdAndUpdate(
    id,
    { name, description, price, tags },
    { new: true, runValidators: true }
  );

  if (!product) {
    throw new NotFoundException('해당 id의 상품을 찾을 수 없습니다.');
  }

  res.status(200).json(product);
});

productsRouter.delete('/:id', async (req, res) => {
  const { id } = req.params;

  const product = await Product.findByIdAndDelete(id);

  if (!product) {
    throw new NotFoundException('해당 id의 상품을 찾을 수 없습니다.');
  }

  res.status(200).json({ message: '상품이 삭제되었습니다.' });
});
