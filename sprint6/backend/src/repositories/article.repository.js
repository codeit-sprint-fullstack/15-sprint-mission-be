import { prisma } from '#db/prisma.js';

function create(data) {
  return prisma.article.create({ data });
}

function findById(articleId) {
  return prisma.article.findUnique({
    where: { id: Number(articleId) },
  });
}

async function findAll({ offset = 0, limit = 10, keyword = '' } = {}) {
  const where = keyword
    ? {
        OR: [
          { title: { contains: keyword, mode: 'insensitive' } },
          { content: { contains: keyword, mode: 'insensitive' } },
        ],
      }
    : {};

  const [list, totalCount] = await Promise.all([
    prisma.article.findMany({
      where,
      skip: offset,
      take: limit,
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      select: { id: true, title: true, content: true, createdAt: true },
    }),
    prisma.article.count({ where }),
  ]);

  return { list, totalCount };
}

function update(articleId, data) {
  return prisma.article.update({
    where: { id: Number(articleId) },
    data,
  });
}

function remove(articleId) {
  return prisma.article.delete({
    where: { id: Number(articleId) },
  });
}

export const articleRepository = {
  create,
  findById,
  findAll,
  update,
  remove,
};
