import express from 'express';
import { NotFoundException } from '../error/Not-found-excep.js';
import { ERROR_MESSAGE, HTTP_STATUS } from '#constants';
import { productCommentsRepository } from '../repository/productComments.repository.js';
import { BadRequestException } from '../error/Bad-request-excep.js';

export const productCommentsRouter = express.Router({ mergeParams: true });

//GET
productCommentsRouter.get('/', async (req, res, next) => {
  try {
    const { itemId } = req.params; //mergeParams 때문에 꺼내올 수 있음
    const { cursor, limit } = req.query;

    if (!itemId) {
      throw new BadRequestException(ERROR_MESSAGE.ITEMID_REQUIRED);
    }

    const comments = await productCommentsRepository.findByItemId({
      itemId,
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
productCommentsRouter.post('/', async (req, res, next) => {
  try {
    const { content, writerId } = req.body ?? {};
    const { itemId } = req.params;

    //댓글 내용, 유저 아이디가 없는 경우 검증하는 로직
    if (!content) {
      throw new BadRequestException('댓글 내용은 필수로 작성해주세요');
    }
    if (!writerId) {
      throw new BadRequestException(ERROR_MESSAGE.REQUIRED_USER_ID);
    }

    //상품이 DB에 실제 존재하는지 검증하는 로직
    const item = await productCommentsRepository.findByItemIdOne(itemId);
    if (!item) {
      throw new NotFoundException(ERROR_MESSAGE.ITEM_NOT_FOUND);
    }

    const newComment = await productCommentsRepository.create({
      content,
      itemId: Number(itemId),
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
