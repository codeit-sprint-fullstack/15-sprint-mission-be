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
