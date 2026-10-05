import * as articleRepository from '#src/repositories/articleRepository.js';
import { NotFoundException } from '#src/errors/not-found-exception.js';

export const createArticle = async (articleData) => {
  return await articleRepository.createArticle(articleData);
};

export const getArticles = async (query = {}) => {
  const page = Number(query.page) || 1;
  const pageSize = Number(query.pageSize) || 10;
  const { keyword, orderBy = 'recent' } = query;

  const limit = pageSize;
  const skip = (page - 1) * limit;

  const where = {};
  if (keyword) {
    where.OR = [
      { title: { contains: keyword, mode: 'insensitive' } },
      { content: { contains: keyword, mode: 'insensitive' } },
    ];
  }

  const orderByOption = {
    createdAt: orderBy === 'oldest' ? 'asc' : 'desc',
  };

  const { articles, totalCount } = await articleRepository.getArticles({
    skip,
    limit,
    where,
    orderBy: orderByOption,
  });

  return { list: articles, totalCount };
};

export const getArticleById = async (id) => {
  const article = await articleRepository.getArticleById(id);

  if (!article) {
    throw new NotFoundException('존재하지 않는 게시글입니다.');
  }

  return article;
};

export const updateArticle = async (id, updateData) => {
  await getArticleById(id);
  return await articleRepository.updateArticle(id, updateData);
};

export const deleteArticle = async (id) => {
  await getArticleById(id);
  return await articleRepository.deleteArticle(id);
};