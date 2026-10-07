import express from 'express';
import { articleCommentsRepository } from '../repository/articleComments.repository.js';
import { ERROR_MESSAGE, HTTP_STATUS } from '#constants';
import { NotFoundException } from '../error/Not-found-excep.js';
import { BadRequestException } from '../error/Bad-request-excep.js';

export const articleCommentsRouter = express.Router({ mergeParams: true });

//GET
articleCommentsRouter.get('/', async (req, res, next) => {
  try {
    const { articleId } = req.params; //mergeParams 때문에 꺼내올 수 있음
    const { cursor, limit } = req.query;

    if (!articleId) {
      throw new NotFoundException(ERROR_MESSAGE.ARTICLE_NOT_FOUND);
    }

    const comments = await articleCommentsRepository.findByArticleId({
      articleId,
      cursor,
      limit: limit ? Number(limit) : undefined, //query로 받아오는 값은 문자열이기 때문에 숫자형태로 바꿔준다
    });

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      data: comments,
    });
  } catch (error) {
    next(error);
  }
});

//POST
articleCommentsRouter.post('/', async (req, res, next) => {
  try {
    const { content, writerId } = req.body ?? {};
    const { articleId } = req.params;

    if (!content) {
      throw new BadRequestException('댓글 내용은 필수로 작성해주세요');
    }
    if (!writerId) {
      throw new BadRequestException(ERROR_MESSAGE.REQUIRED_USER_ID);
    }

    const newComment = await articleCommentsRepository.create({
      content,
      articleId: Number(articleId),
      writerId: Number(writerId),
    });

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      data: newComment,
    });
  } catch (error) {
    next(error);
  }
});

//PATCH
articleCommentsRouter.patch('/:commentId', async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body ?? {};

    if (!content) {
      throw new BadRequestException('댓글 내용은 필수로 작성해주세요');
    }

    const updated = await articleCommentsRepository.update(commentId, {
      content,
    });

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
});
//DELETE
articleCommentsRouter.delete('/:commentId', async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const deletedData = await articleCommentsRepository.remove(commentId);

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      data: deletedData,
      message: '댓글이 삭제되었습니다.',
    });
  } catch (error) {
    next(error);
  }
});
