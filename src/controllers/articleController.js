import * as articleService from '#src/services/articleService.js';

export const createArticle = async (req, res) => {
  const article = await articleService.createArticle(req.body);
  res.status(201).json(article);
};

export const getArticles = async (req, res) => {
  const result = await articleService.getArticles(req.query);
  res.status(200).json(result);
};

export const getArticleById = async (req, res) => {
  const article = await articleService.getArticleById(Number(req.params.id));
  res.status(200).json(article);
};

export const updateArticle = async (req, res) => {
  const article = await articleService.updateArticle(Number(req.params.id), req.body);
  res.status(200).json(article);
};

export const deleteArticle = async (req, res) => {
  await articleService.deleteArticle(Number(req.params.id));
  res.status(204).send();
};