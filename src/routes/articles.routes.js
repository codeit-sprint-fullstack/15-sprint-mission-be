import express from 'express';
import { articleRepository } from '../repository/articles.repository.js';
import { NotFoundException } from '../error/Not-found-excep.js';
import { ERROR_MESSAGE, HTTP_STATUS } from '#constants';
import { BadRequestException } from '../error/Bad-request-excep.js';
import { articleCommentsRouter } from './articleComments.routes.js';

export const articleRouter = express.Router();

//GET 전체 게시글 조회
articleRouter.get('/', async (req, res) => {
  const articles = await articleRepository.findAll();
  return res.json(articles);
});

//특정 게시글 조회
articleRouter.get('/:articleId', async (req, res) => {
  const { articleId } = req.params;
  const article = await articleRepository.findById(articleId);

  if (!article) {
    throw new NotFoundException(ERROR_MESSAGE.POST_NOT_FOUND);
  }

  return res.status(HTTP_STATUS.OK).json({
    success: true,
    data: article,
  });
});

//게시글 생성
articleRouter.post('/', async (req, res) => {
  const { title, content, published, writerId } = req.body ?? {};

  if (!title || !writerId) {
    throw new BadRequestException(ERROR_MESSAGE.TITLE_AND_AUTHOR_ID_REQUIRED);
  }

  const newArticle = await articleRepository.create({
    title,
    content,
    published: published ?? false,
    writerId: Number(writerId),
  });

  return res.status(HTTP_STATUS.OK).json({
    success: true,
    data: newArticle,
  });
});

//update 게시글 수정
articleRouter.patch('/:articleId', async (req, res) => {
  const { articleId } = req.params;

  const article = await articleRepository.update(articleId, req.body);

  return res.status(HTTP_STATUS.OK).json({
    success: true,
    data: article,
  });
});

//delete 게시글 삭제
articleRouter.delete('/:articleId', async (req, res) => {
  const { articleId } = req.params;
  await articleRepository.remove(articleId);

  return res.sendStatus(HTTP_STATUS.NO_CONTENT);
});

articleRouter.use('/:articleId/comments', articleCommentsRouter);
