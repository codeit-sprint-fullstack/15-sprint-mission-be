import * as articleRepository from '#src/repositories/article.repository.js';

export const createArticleService = async ({ title, content }) => {
  const newArticle = await articleRepository.createArticle({ title, content });

  return newArticle;
};
