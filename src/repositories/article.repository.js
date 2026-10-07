import { prisma } from '#db/prisma.js';

function findById(articleId) {
  return prisma.article.findUnique({
    where: { id: articleId },
  });
}

function findAll(page, limit, orderBy, keyword) {
  const validOrderBy = orderBy === 'asc' ? 'asc' : 'desc';
  return prisma.article.findMany({
    where: keyword
      ? {
          OR: [
            { title: { contains: keyword, mode: 'insensitive' } },
            { content: { contains: keyword, mode: 'insensitive' } },
          ],
        }
      : {},
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { createdAt: validOrderBy },
  });
}

function create(data) {
  return prisma.article.create({
    data,
  });
}

function update(articleId, data) {
  return prisma.article.update({
    where: { id: articleId },
    data,
  });
}

function remove(articleId) {
  return prisma.article.delete({
    where: { id: articleId },
  });
}

export const articlesRepository = {
  findAll,
  findById,
  create,
  update,
  remove,
};
