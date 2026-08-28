import { prisma } from '#db/prisma.js';

function createArticle(data) {
  return prisma.article.create({ data });
}

function find(page, limit, sort, keyword) {
  const validSort = sort === 'asc' ? 'asc' : 'desc';
  const pageNum = Number(page) || 1;
  const limitNum = Number(limit) || 10;
  return prisma.article.findMany({
    where: keyword
      ? {
          OR: [
            { title: { contains: keyword, mode: 'insensitive' } },
            { content: { contains: keyword, mode: 'insensitive' } },
          ],
        }
      : {},
    skip: (pageNum - 1) * limitNum,
    take: limitNum,
    orderBy:[ { createdAt: validSort },
    { id: 'asc' },]
  });
}

function findById(articleId) {
  return prisma.article.findUnique({
    where: { id: Number(articleId) },
  });
}

function count(keyword) {
  return prisma.article.count({
    where: keyword
      ? {
          OR: [
            { title: { contains: keyword, mode: 'insensitive' } },
            { content: { contains: keyword, mode: 'insensitive' } },
          ],
        }
      : {},
  });
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

export const articlesRepository = {
  createArticle,
  findById,
  find,
  count,
  update,
  remove,
};
