import express from 'express';
import { prisma } from '#src/db/prisma.js';

const productRouter = express.Router();

productRouter.post('/', async (req, res) => {
  try {
    const { name, description, price, tags } = req.body;

    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        price,
        tags,
      },
    });

    return res.status(201).json(newProduct);
  } catch (error) {
    console.error('상품 등록 오류:', error);

    if (error.name === 'PrismaClientValidationError') {
      return res.status(400).json({ message: error.message });
    }

    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

productRouter.get('/', async (req, res) => {
  try {
    const { page = 1, pageSize = 10, keyword, orderBy = 'recent' } = req.query;

    const limit = Number(pageSize);
    const skip = (Number(page) - 1) * limit;

    const where = {};
    if (keyword) {
      where.OR = [
        { name: { contains: String(keyword), mode: 'insensitive' } },
        { description: { contains: String(keyword), mode: 'insensitive' } },
      ];
    }

    const orderByOption = {};
    if (orderBy === 'recent') {
      orderByOption.createdAt = 'desc';
    } else if (orderBy === 'oldest') {
      orderByOption.createdAt = 'asc';
    }

    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        select: {
          id: true,
          name: true,
          price: true,
          createdAt: true,
        },
        orderBy: orderByOption,
        skip: skip,
        take: limit,
      }),
      prisma.product.count({
        where,
      }),
    ]);

    return res.status(200).json({
      list: products,
      totalCount: totalCount,
    });
  } catch (error) {
    console.error('상품 목록 조회 오류:', error);
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

productRouter.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const productId = Number(id);
    if (isNaN(productId)) {
      return res
        .status(400)
        .json({ message: '유효하지 않은 상품 ID 형식입니다.' });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return res.status(404).json({ message: '존재하지 않는 상품입니다.' });
    }

    return res.status(200).json(product);
  } catch (error) {
    console.error('상품 상세 조회 오류:', error);
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

productRouter.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const productId = Number(id);
    if (isNaN(productId)) {
      return res.status(400).json({ message: '잘못된 ID 형식입니다.' });
    }

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: req.body,
    });

    return res.status(200).json(updatedProduct);
  } catch (error) {
    if (error.name === 'P2025') {
      return res.status(404).json({ message: '존재하지 않는 상품입니다.' });
    }
    console.error('상품 수정 오류:', error);
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

productRouter.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const productId = Number(id);
    if (isNaN(productId)) {
      return res.status(400).json({ message: '잘못된 ID 형식입니다.' });
    }

    await prisma.product.delete({
      where: { id: productId },
    });

    return res
      .status(200)
      .json({ message: '상품이 성공적으로 삭제되었습니다.', id });
  } catch (error) {
    if (error.name === 'P2025') {
      return res.status(404).json({ message: '존재하지 않는 상품입니다.' });
    }
    console.error('상품 삭제 오류:', error);
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

export default productRouter;
