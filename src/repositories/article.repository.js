import { prisma } from '#src/db/prisma.js';

export const createArticle = async ({ title, content }) => {
  return await prisma.article.create({
    data: {
      title,
      content,
    },
  });
};

export const findArticleById = async (id) => {
  return await prisma.article.findUnique({
    where: {
      id,
      deletedAt: null,
    },
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
    },
  });
};

export const updateArticle = async ({ id, title, content }) => {
  return await prisma.article.update({
    where: { id },
    data: {
      ...(title && { title }),
      ...(content && { content }),
    },
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

export const deleteArticle = async (id) => {
  return await prisma.article.update({
    where: { id },
    data: {
      deletedAt: new Date(),
    },
  });
};
