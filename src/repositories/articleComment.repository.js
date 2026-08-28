import { prisma } from '#db/prisma.js';

function createArticleComment(data) {
  return prisma.articleComment.create({data});
}

function find(cursor, limit, sort, keyword) {
  return prisma.articleComment.findMany({
    where: keyword
      ? { content: { contains: keyword, mode: 'insensitive' } }
      : {},
    take: Number(limit) || 10,
    ...(cursor && {
      cursor: { id: Number(cursor) },
      skip: 1,
    }),
    orderBy: [{ createdAt: sort === 'asc' ? 'asc' : 'desc' }, { id: 'asc' }],
  });
}

function findById(articleCommentId) {
  return prisma.articleComment.findUnique({
    where: { id: Number(articleCommentId) },
  });
}

function count(keyword) {
  return prisma.articleComment.count({
    where: keyword
      ? { content: { contains: keyword, mode: 'insensitive' } }
      : {},
  });
}

function update(articleCommentId, data) {
  return prisma.articleComment.update({
    where: { id: Number(articleCommentId) },
    data,
  });
}

function remove(articleCommentId) {
  return prisma.articleComment.delete({
    where: { id: Number(articleCommentId) },
  });
}

export const articleCommentRepository = {
  createArticleComment,
  findById,
  find,
  count,
  update,
  remove,
};
