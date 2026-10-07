import express from 'express';
import { z } from 'zod';
import { HTTP_STATUS } from '#constants'
import { commentRepository, productRepository } from '#repositories';
import { validateCommentPagination, validatePagination, validateProductPatchBody, validateProductPostBody } from '#middlewares';
import { validateCommentBody } from '../middlewares/validate-comment.middleware.js';
import { BadRequestException } from '#errors';

export const productRouter = express.Router();

productRouter.param('productId', (req, res, next, value) => {
  try {
    req.productId = z.coerce.number().int().positive().parse(value);
    return next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new BadRequestException('상품 id가 올바르지 않습니다.'));
    }
    return next(error);
  }
});

productRouter.post('/', validateProductPostBody, async (req, res) => {
  const { name, description, price, tags, images } = req.body ?? {};

  const product = await productRepository.create({
    name,
    description,
    price,
    tags,
    images,
  });

  return res.status(HTTP_STATUS.CREATED).json({ success: true, data: product });
});

productRouter.get('/', validatePagination, async (req, res) => {
  const { offset, limit, keyword } = req.validatedQuery;
  const { list, totalCount } = await productRepository.findAll({
    offset,
    limit,
    keyword,
  });

  return res
    .status(HTTP_STATUS.OK)
    .json({ success: true, data: list, totalCount });
});

productRouter.patch('/:productId', validateProductPatchBody, async (req, res) => {
  const productId = req.productId;
  const { name, description, price, tags, images } = req.body ?? {};

  const product = await productRepository.update(productId, {
    name,
    description,
    price,
    tags,
    images,
  });

  return res.status(HTTP_STATUS.OK).json({ success: true, data: product });
});

productRouter.delete('/:productId', async (req, res) => {
  const productId = req.productId;
  await productRepository.remove(productId);
  return res.status(HTTP_STATUS.NO_CONTENT).send();
});

productRouter.post('/:productId/comments', validateCommentBody, async (req, res) => {
  const productId = req.productId
  const { content } = req.body ?? {};
  const comment = await commentRepository.create({ content, productId });
  return res.status(HTTP_STATUS.CREATED).json({ success: true, data: comment });
});

productRouter.get('/:productId/comments', validateCommentPagination, async (req, res) => {
  const productId = req.productId
  const { cursor, limit } = req.validatedQuery;
  const { list, nextCursor } =
    await commentRepository.findAllByParent({productId, cursor, limit});
  return res
    .status(HTTP_STATUS.OK)
    .json({ success: true, data: list, nextCursor });
});
