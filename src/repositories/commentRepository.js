import { prisma } from '#src/db/prisma.js';

const getTargetConfig = (target) => {
  if (target === 'product') {
    return { model: prisma.productComment, key: 'productId' };
  }
  return { model: prisma.articleComment, key: 'articleId' };
};

export const createComment = async (target, parentId, data) => {
  const { model, key } = getTargetConfig(target);
  return await model.create({
    data: {
      ...data,
      [key]: parentId,
    },
    select: { id: true, content: true, createdAt: true },
  });
};

export const getComments = async (target, parentId, { cursor, limit }) => {
  const { model, key } = getTargetConfig(target);

  const comments = await model.findMany({
    where: { [key]: parentId },
    take: limit + 1,
    ...(cursor && {
      cursor: { id: cursor },
      skip: 1,
    }),
    orderBy: { id: 'desc' },
    select: { id: true, content: true, createdAt: true },
  });

  let nextCursor = null;
  if (comments.length > limit) {
    comments.pop();
    nextCursor = comments[comments.length - 1].id;
  }

  return { list: comments, nextCursor };
};

export const getCommentById = async (target, id) => {
  const { model } = getTargetConfig(target);
  return await model.findUnique({ where: { id } });
};

export const updateComment = async (target, id, data) => {
  const { model } = getTargetConfig(target);
  return await model.update({
    where: { id },
    data,
    select: { id: true, content: true, createdAt: true },
  });
};

export const deleteComment = async (target, id) => {
  const { model } = getTargetConfig(target);
  return await model.delete({ where: { id } });
};