import { prisma } from '#db/prisma.js';

function createProductComment(data) {
  return prisma.productComment.create({data});
}

function find(cursor, limit, sort, keyword) {
  return prisma.productComment.findMany({
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

function findById(productCommentId) {
  return prisma.productComment.findUnique({
    where: { id: Number(productCommentId) },
  });
}

function count(keyword) {
  return prisma.productComment.count({
    where: keyword
      ? { content: { contains: keyword, mode: 'insensitive' } }
      : {},
  });
}

function update(productCommentId, data) {
  return prisma.productComment.update({
    where: { id: Number(productCommentId) },
    data,
  });
}

function remove(productCommentId) {
  return prisma.productComment.delete({
    where: { id: Number(productCommentId) },
  });
}

export const productCommentRepository = {
  createProductComment,
  findById,
  find,
  count,
  update,
  remove,
};
