import { prisma } from '#db/prisma.js';

function findById(commentId) {
  return prisma.comment.findUnique({
    where: { id: commentId },
  });
}

function findAll(target, cursor) {
  return prisma.comment.findMany({
    where: {
      ...target,
      ...(cursor
        ? {
            OR: [
              { createdAt: { lt: new Date(cursor.createdAt) } },
              {
                createdAt: new Date(cursor.createdAt),
                id: { lt: cursor.id },
              },
            ],
          }
        : {}),
    },
    orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    ...(cursor ? { take: 10 } : {}),
    select: {
      id: true,
      content: true,
      createdAt: true,
    },
  });
}

function create(content, productId = null, articleId = null) {
  return prisma.comment.create({
    data: {
      content,
      ...(productId !== null
        ? { product: { connect: { id: productId } } }
        : { article: { connect: { id: articleId } } }),
    },
  });
}

function update(commentId, data) {
  return prisma.comment.update({
    where: { id: commentId },
    data,
  });
}

function remove(commentId) {
  return prisma.comment.delete({
    where: { id: commentId },
  });
}

export const commentRepository = {
  findById,
  findAll,
  create,
  update,
  remove,
};
