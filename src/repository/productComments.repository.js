import { prisma } from '#db/prisma.js';

function create(data) {
  return prisma.productComment.create({ data });
}

function findById(commentId, include = undefined) {
  return prisma.productComment.findUnique({
    where: {
      id: Number(commentId),
    },
    ...(include && { include }), // 관계된 writer= User 정보를 불러오는 것
  });
}

function findByItemIdOne(itemId) {
  return prisma.item.findUnique({
    where: {
      id: Number(itemId),
    },
    select: { id: true, name: true, price: true, createdAt: true },
  });
}

async function findByItemId({ itemId, cursor, limit = 10 } = {}) {
  const comments = await prisma.productComment.findMany({
    where: { itemId: Number(itemId) },
    take: limit + 1,
    ...(cursor && {
      cursor: { id: Number(cursor) },
      skip: 1,
    }),
    orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    select: { id: true, content: true, createdAt: true },
  });
  const hasNext = comments.length > limit;
  const data = hasNext ? comments.slice(0, limit) : comments;
  const nextCursor = hasNext ? data[data.length - 1].id : null;

  return { data, nextCursor };
}

function update(commentId, data) {
  return prisma.productComment.update({
    where: {
      id: Number(commentId),
    },
    data,
  });
}

function remove(commentId) {
  return prisma.productComment.delete({
    where: {
      id: Number(commentId),
    },
  });
}

export const productCommentsRepository = {
  create,
  findById,
  findByItemIdOne,
  findByItemId,
  update,
  remove,
};
