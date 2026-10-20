import { prisma } from '#db/prisma.js';

function create(data) {
  return prisma.articleComment.create({
    data,
    select: {
      id: true,
      content: true,
      createdAt: true,
      writer: { select: { id: true, name: true } },
    },
  });
}

function findById(commentId, include = undefined) {
  return prisma.articleComment.findUnique({
    where: {
      id: Number(commentId),
    },
    ...(include && { include }), // 관계된 writer= User 정보를 불러오는 것
  });
}

async function findByArticleId({ articleId, cursor, limit = 10 } = {}) {
  const comments = await prisma.articleComment.findMany({
    where: { articleId: Number(articleId) },
    take: limit + 1,
    ...(cursor && {
      cursor: { id: Number(cursor) },
      skip: 1,
    }),
    orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    select: {
      id: true,
      content: true,
      createdAt: true,
      writer: { select: { id: true, name: true } },
    },
  });
  const hasNext = comments.length > limit;
  const data = hasNext ? comments.slice(0, limit) : comments;
  const nextCursor = hasNext ? data[data.length - 1].id : null;

  return { data, nextCursor };
}

function update(commentId, data) {
  return prisma.articleComment.update({
    where: {
      id: Number(commentId),
    },
    data,
  });
}

function remove(commentId) {
  return prisma.articleComment.delete({
    where: {
      id: Number(commentId),
    },
  });
}

export const articleCommentsRepository = {
  create,
  findById,
  findByArticleId,
  update,
  remove,
};
