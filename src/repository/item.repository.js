import { prisma } from '#db/prisma.js';

function findMany({ page = 1, limits = 10, orderBy = 'recent', keyword = '' }) {
  const offset = (Number(page) - 1) * Number(limits);

  const where = keyword
    ? {
        OR: [
          { name: { contains: keyword, mode: 'insensitive' } },
          { description: { contains: keyword, mode: 'insensitive' } },
        ],
      }
    : {};
  const orderByOption = orderBy === 'recent' ? { createdAt: 'desc' } : {};

  return Promise.all([
    prisma.item.findMany({
      where,
      orderBy: orderByOption,
      skip: offset,
      take: Number(limits),
    }),
    prisma.item.count({ where }),
  ]);
}
function findById(itemId) {
  return prisma.item.findUnique({ where: { id: Number(itemId) } });
}

function findByName(name) {
  return prisma.item.findFirst({ where: { name } });
}

function create(data) {
  return prisma.item.create({ data });
}

function update(itemId, data) {
  return prisma.item.update({ where: { id: Number(itemId) }, data });
}

function remove(itemId) {
  return prisma.item.delete({ where: { id: Number(itemId) } });
}

export const itemRepository = {
  findMany,
  findById,
  findByName,
  create,
  update,
  remove,
};