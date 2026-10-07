import { NotFoundException } from '#src/errors/not-found-exception.js';
import * as articleRepository from '#src/repositories/article.repository.js';
import { ERROR_MESSAGES } from '../constants/index.js';

export const createArticleService = async ({ title, content }) => {
  const newArticle = await articleRepository.createArticle({ title, content });

  return newArticle;
};

export const getArticleByIdService = async (id) => {
  const article = await articleRepository.findArticleById(id);

  if (!article) {
    throw new NotFoundException(ERROR_MESSAGES.ARTICLE.NOT_FOUND);
  }

  return article;
};

export const updateArticleById = async ({ id, title, content }) => {
  const existingArticle = await articleRepository.findArticleById(id);

  if (!existingArticle) {
    throw new NotFoundException(ERROR_MESSAGES.ARTICLE.NOT_FOUND);
  }

  const updatedArticle = await articleRepository.updateArticle({
    id,
    title,
    content,
  });

  return updatedArticle;
};

export const deleteArticleById = async (id) => {
  const existingArticle = await articleRepository.findArticleById(id);

  if (!existingArticle) {
    throw new NotFoundException(ERROR_MESSAGES.ARTICLE.ALREADY_DELETED);
  }

  const deletedArticle = await articleRepository.deleteArticle(id);
  return deletedArticle;
};
