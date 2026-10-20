import * as commentService from '#src/services/commentService.js';

export const createProductComment = (req, res) =>
  createComment('product', Number(req.params.productId), req, res);

export const getProductComments = (req, res) =>
  getComments('product', Number(req.params.productId), req, res);

export const updateProductComment = (req, res) =>
  updateComment('product', Number(req.params.id), req, res);

export const deleteProductComment = (req, res) =>
  deleteComment('product', Number(req.params.id), req, res);

export const createArticleComment = (req, res) =>
  createComment('article', Number(req.params.articleId), req, res);

export const getArticleComments = (req, res) =>
  getComments('article', Number(req.params.articleId), req, res);

export const updateArticleComment = (req, res) =>
  updateComment('article', Number(req.params.id), req, res);

export const deleteArticleComment = (req, res) =>
  deleteComment('article', Number(req.params.id), req, res);

async function createComment(target, parentId, req, res) {
  const comment = await commentService.createComment(
    target,
    parentId,
    req.body,
  );
  res.status(201).json(comment);
}

async function getComments(target, parentId, req, res) {
  const result = await commentService.getComments(target, parentId, req.query);
  res.status(200).json(result);
}

async function updateComment(target, id, req, res) {
  const comment = await commentService.updateComment(target, id, req.body);
  res.status(200).json(comment);
}

async function deleteComment(target, id, req, res) {
  await commentService.deleteComment(target, id);
  res.status(204).send();
}
