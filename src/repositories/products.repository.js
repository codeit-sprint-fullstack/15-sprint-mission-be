import { prisma } from '#db/prisma.js';

function createProduct(data) {
  return prisma.product.create({ data });
}

function find(page, limit, sort, keyword) {
  const validSort = sort === 'asc' ? 'asc' : 'desc';
  const pageNum = Number(page) || 1;
  const limitNum = Number(limit) || 10;
  return prisma.product.findMany({
    where: keyword
      ? {
          OR: [
            { name: { contains: keyword, mode: 'insensitive' } },
            { description: { contains: keyword, mode: 'insensitive' } },
            { tags: { hasSome: [keyword] } },
          ],
        }
      : {},
    skip: (pageNum - 1) * limitNum,
    take: limitNum,
    orderBy: { createdAt: validSort },
  });
}

function findById(productId) {
  return prisma.product.findUnique({
    where: { id: Number(productId) },
  });
}

function count(keyword) {
  return prisma.product.count({
    where: keyword
      ? {
          OR: [
            { name: { contains: keyword, mode: 'insensitive' } },
            { description: { contains: keyword, mode: 'insensitive' } },
            { tags: { hasSome: [keyword] } },
          ],
        }
      : {},
  });
}

function update(productId, data) {
  return prisma.product.update({
    where: { id: Number(productId) },
    data,
  });
}

function remove(productId) {
  return prisma.product.delete({
    where: { id: Number(productId) },
  });
}

export const productsRepository = {
  createProduct,
  findById,
  find,
  count,
  update,
  remove,
};
