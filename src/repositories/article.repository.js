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

export const findArticles = async ({ skip, take, where }) => {
  const [list, totalCount] = await Promise.all([
    prisma.article.findMany({
      skip,
      take,
      where,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
      },
    }),
    // 2. 조건에 부합하는 전체 게시글 개수 조회
    prisma.article.count({
      where,
    }),
  ]);

  return { list, totalCount };
};
