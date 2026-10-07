import { NotFoundException } from '#src/errors/not-found-exception.js';
import * as articleReplyRepository from '#src/repositories/article-reply.repository.js';
import * as articleRepository from '#src/repositories/article.repository.js';
import { ERROR_MESSAGES } from '../constants/index.js';

export const createReplyService = async ({ articleId, content }) => {
  const article = await articleRepository.findArticleById(articleId);

  if (!article) {
    throw new NotFoundException(ERROR_MESSAGES.ARTICLE.NOT_FOUND);
  }

  const newReply = await articleReplyRepository.createReply({
    articleId,
    content,
  });

  return newReply;
};

export const updateReplyService = async ({ id, content }) => {
  const existingReply = await articleReplyRepository.findReplyById(id);

  if (!existingReply) {
    throw new NotFoundException(ERROR_MESSAGES.REPLY.NOT_FOUND);
  }

  const updatedReply = await articleReplyRepository.updateReply({
    id,
    content,
  });

  return updatedReply;
};

export const deleteReplyService = async (id) => {
  const existingReply = await articleReplyRepository.findReplyById(id);

  if (!existingReply) {
    throw new NotFoundException(ERROR_MESSAGES.REPLY.NOT_FOUND);
  }
  const deletedReply = await articleReplyRepository.deleteReply(id);

  return deletedReply;
};
