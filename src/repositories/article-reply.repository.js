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
