import { prisma } from '#src/db/prisma.js';

export const createArticle = async ({ title, content }) => {
  return await prisma.article.create({
    data: {
      title,
      content,
    },
  });
};
