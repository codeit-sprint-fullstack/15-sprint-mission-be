import * as commentRepository from '#src/repositories/commentRepository.js';
import * as productRepository from '#src/repositories/productRepository.js';
import * as articleRepository from '#src/repositories/articleRepository.js';
import { NotFoundException } from '#src/errors/not-found-exception.js';

const validateParentExists = async (target, parentId) => {
  let parent = null;
  if (target === 'product') {
    parent = await productRepository.getProductById(parentId);
  } else {
    parent = await articleRepository.getArticleById(parentId);
  }

  if (!parent) {
    const message = target === 'product' ? '존재하지 않는 상품입니다.' : '존재하지 않는 게시글입니다.';
    throw new NotFoundException(message);
  }
};

export const createComment = async (target, parentId, commentData) => {
  await validateParentExists(target, parentId);
  return await commentRepository.createComment(target, parentId, commentData);
};

export const getComments = async (target, parentId, query = {}) => {
  await validateParentExists(target, parentId);
  const limit = Number(query.limit) || 10;
  const cursor = query.cursor ? Number(query.cursor) : undefined;

  return await commentRepository.getComments(target, parentId, { cursor, limit });
};

export const updateComment = async (target, id, updateData) => {
  const comment = await commentRepository.getCommentById(target, id);
  if (!comment) throw new NotFoundException('존재하지 않는 댓글입니다.');

  return await commentRepository.updateComment(target, id, updateData);
};

export const deleteComment = async (target, id) => {
  const comment = await commentRepository.getCommentById(target, id);
  if (!comment) throw new NotFoundException('존재하지 않는 댓글입니다.');

  return await commentRepository.deleteComment(target, id);
};