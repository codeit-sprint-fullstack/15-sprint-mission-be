import { prisma } from '#src/db/prisma.js';

export const createReply = async ({ articleId, content }) => {
  return await prisma.articleReply.create({
    data: {
      articleId,
      content,
    },
    select: {
      id: true,
      articleId: true,
      content: true,
      createdAt: true,
    },
  });
};

export const findReplyById = async (id) => {
  return await prisma.articleReply.findUnique({
    where: {
      id,
      deletedAt: null,
    },
  });
};

export const updateReply = async ({ id, content }) => {
  return await prisma.articleReply.update({
    where: { id },
    data: { content },
    select: {
      id: true,
      articleId: true,
      content: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

export const deleteReply = async (id) => {
  return await prisma.articleReply.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
};

export const findRepliesByArticleId = async ({ articleId, limit, cursor }) => {
  return await prisma.articleReply.findMany({
    where: {
      articleId,
      deletedAt: null,
    },
    ...(cursor && { cursor: { id: cursor } }),
    skip: cursor ? 1 : 0,
    take: limit,
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      id: true,
      articleId: true,
      content: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};
