import express from 'express';
import { ERROR_MESSAGES, HTTP_STATUS } from '#constants';
import { BadRequestException, NotFoundException } from '#errors';
import { commentRepository, productRepository } from '#repositories';
import {
  parseCursorQuery,
  parseIdParam,
  parseListQuery,
} from './query-parsers.js';

export const productsRouter = express.Router();

productsRouter.post('/', async (req, res) => {
  const { name, description, price, tags } = req.body ?? {};

  if (!name || !description || price == null) {
    throw new BadRequestException(ERROR_MESSAGES.PRODUCT_REQUIRED_FIELDS);
  }

  const product = await productRepository.create({
    name,
    description,
    price: Number(price),
    tags: Array.isArray(tags) ? tags : [],
  });

  return res.status(HTTP_STATUS.CREATED).json({ success: true, data: product });
});

productsRouter.get('/', async (req, res) => {
  const { offset, limit, keyword } = parseListQuery(req.query);

  const data = await productRepository.findAll({ offset, limit, keyword });

  return res.status(HTTP_STATUS.OK).json({ success: true, data });
});

productsRouter.get('/:productId', async (req, res) => {
  const productId = parseIdParam(req.params.productId);

  const product = await productRepository.findById(productId);
  if (!product) {
    throw new NotFoundException(ERROR_MESSAGES.PRODUCT_NOT_FOUND);
  }

  return res.status(HTTP_STATUS.OK).json({ success: true, data: product });
});

productsRouter.patch('/:productId', async (req, res) => {
  const productId = parseIdParam(req.params.productId);
  const { name, description, price, tags } = req.body ?? {};

  if (name == null && description == null && price == null && tags == null) {
    throw new BadRequestException(ERROR_MESSAGES.UPDATE_PRODUCT_REQUIRED);
  }

  const product = await productRepository.update(productId, {
    ...(name != null && { name }),
    ...(description != null && { description }),
    ...(price != null && { price: Number(price) }),
    ...(tags != null && { tags }),
  });

  return res.status(HTTP_STATUS.OK).json({ success: true, data: product });
});

productsRouter.delete('/:productId', async (req, res) => {
  const productId = parseIdParam(req.params.productId);

  await productRepository.remove(productId);

  return res.sendStatus(HTTP_STATUS.NO_CONTENT);
});

productsRouter.post('/:productId/comments', async (req, res) => {
  const productId = parseIdParam(req.params.productId);
  const { content } = req.body ?? {};

  if (!content) {
    throw new BadRequestException(ERROR_MESSAGES.COMMENT_REQUIRED_FIELDS);
  }

  const product = await productRepository.findById(productId);
  if (!product) {
    throw new NotFoundException(ERROR_MESSAGES.PRODUCT_COMMENT_TARGET_MISSING);
  }

  const comment = await commentRepository.create({
    content,
    productId,
  });

  return res.status(HTTP_STATUS.CREATED).json({ success: true, data: comment });
});

productsRouter.get('/:productId/comments', async (req, res) => {
  const productId = parseIdParam(req.params.productId);
  const { limit, cursor } = parseCursorQuery(req.query);

  const product = await productRepository.findById(productId);
  if (!product) {
    throw new NotFoundException(ERROR_MESSAGES.PRODUCT_COMMENT_TARGET_MISSING);
  }

  const data = await commentRepository.findAllByParent({
    productId,
    cursor,
    limit,
  });

  return res.status(HTTP_STATUS.OK).json({ success: true, data });
});
