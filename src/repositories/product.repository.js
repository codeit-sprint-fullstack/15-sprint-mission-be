import { prisma } from '#db/prisma.js';

function create(data) {
  return prisma.product.create({ data });
}

function findById(productId) {
  return prisma.product.findUnique({
    where: { id: Number(productId) },
  });
}

async function findAll({ offset = 0, limit = 10, keyword = '' } = {}) {
  const where = keyword
    ? {
        OR: [
          { name: { contains: keyword, mode: 'insensitive' } },
          { description: { contains: keyword, mode: 'insensitive' } },
        ],
      }
    : {};
  const [list, totalCount] = await Promise.all([
    prisma.product.findMany({
      where,
      skip: offset,
      take: limit,
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      select: { id: true, name: true, price: true, createdAt: true },
    }),
    prisma.product.count({ where }),
  ]);

  return { list, totalCount };
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

export const productRepository = {
  create,
  findById,
  findAll,
  update,
  remove,
};
