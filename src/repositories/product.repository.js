import { prisma } from '#db/prisma.js';

function findById(productId) {
  return prisma.product.findUnique({
    where: { id: productId },
  });
}

function findAll(page, limit, orderBy, keyword) {
  const validOrderBy = orderBy === 'asc' ? 'asc' : 'desc';

  return prisma.product.findMany({
    where: keyword
      ? {
          OR: [
            { name: { contains: keyword, mode: 'insensitive' } },
            { description: { contains: keyword, mode: 'insensitive' } },
          ],
        }
      : {},
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { createdAt: validOrderBy },
  });
}

function create(data) {
  return prisma.product.create({
    data,
  });
}

function update(productId, data) {
  return prisma.product.update({
    where: { id: productId },
    data,
  });
}

function remove(productId) {
  return prisma.product.delete({
    where: { id: productId },
  });
}

export const productRepository = {
  findAll,
  findById,
  create,
  update,
  remove,
};
