import { prisma } from '#src/db/prisma.js';

export const createArticle = async (data) => {
  return await prisma.article.create({
    data,
  });
};

export const getArticles = async ({ skip, limit, where, orderBy }) => {
  const [articles, totalCount] = await Promise.all([
    prisma.article.findMany({
      where,
      orderBy,
      skip,
      take: limit,
    }),
    prisma.article.count({ where }),
  ]);

  return { articles, totalCount };
};

export const getArticleById = async (id) => {
  return await prisma.article.findUnique({
    where: { id },
  });
};

export const updateArticle = async (id, data) => {
  return await prisma.article.update({
    where: { id },
    data,
  });
};

export const deleteArticle = async (id) => {
  return await prisma.article.delete({
    where: { id },
  });
};