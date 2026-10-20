import express from 'express';
import { itemRepository } from '../repository/item.repository.js';
import { BadRequestException } from '../error/Bad-request-excep.js';
import { ConflictException } from '../error/Conflict-excep.js';
import { NotFoundException } from '../error/Not-found-excep.js';
import { productCommentsRouter } from './productComments.routes.js';

export const itemRouter = express.Router();

// GET 목록 조회
itemRouter.get('/', async (req, res, next) => {
  try {
    const {
      page = 1,
      limits = 10,
      orderBy = 'recent',
      keyword = '',
    } = req.query;

    const [itemLists, totalCount] = await itemRepository.findMany({
      page,
      limits,
      orderBy,
      keyword,
    });

    res.status(200).json({
      success: true,
      list: itemLists,
      totalCount,
      message: '상품 목록 조회 성공',
    });
  } catch (error) {
    next(error);
  }
});

// GET 상세 조회
itemRouter.get('/:itemId', async (req, res, next) => {
  try {
    const { itemId } = req.params;

    if (!Number.isInteger(Number(itemId))) {
      throw new BadRequestException('잘못된 Id 값입니다.');
    }

    const targetItem = await itemRepository.findById(itemId);

    if (!targetItem) {
      throw new NotFoundException('상품을 찾을 수 없습니다.');
    }
    res.status(200).json({
      success: true,
      data: targetItem,
      message: '상품 상세 조회 성공',
    });
  } catch (error) {
    next(error);
  }
});

// POST 상품 등록
itemRouter.post('/', async (req, res, next) => {
  try {
    const { name, description, price, tags } = req.body ?? {};

    if (!name || !description || price === undefined) {
      throw new BadRequestException(
        '상품명, 상세설명, 가격은 필수 항목입니다.',
      );
    }

    if (name.length <= 0 || name.length > 10) {
      throw new BadRequestException(
        '상품명은 1자 이상 10자 이내로 작성해주세요',
      );
    }

    if (description.length < 10 || description.length >= 100) {
      throw new BadRequestException(
        '상품설명은 10자 이상 100자 이내로 작성해주세요',
      );
    }

    if (price < 0 || typeof price !== 'number') {
      throw new BadRequestException('가격은 1자 이상, 숫자여야 합니다.');
    }

    if (tags !== undefined && !Array.isArray(tags)) {
      throw new BadRequestException('태그는 배열 상태여야 합니다.');
    }

    const exist = await itemRepository.findByName(name);
    if (exist) {
      throw new ConflictException('동일한 이름의 상품이 존재합니다.');
    }

    const newItem = await itemRepository.create({
      name,
      description,
      price,
      tags,
    });

    res.status(201).json({
      success: true,
      data: newItem,
      message: '상품 등록이 완료되었습니다.',
    });
  } catch (error) {
    next(error);
  }
});

// PATCH 상품 수정
itemRouter.patch('/:itemId', async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const patchItem = await itemRepository.findById(itemId);

    if (!patchItem) {
      throw new NotFoundException('수정할 상품을 찾을 수 없습니다.');
    }

    const { name, description, price, tags } = req.body ?? {};

    if (name !== undefined && (name.length <= 0 || name.length > 10)) {
      throw new BadRequestException(
        '상품명은 1자 이상 10자 이내로 작성해주세요',
      );
    }

    if (
      description !== undefined &&
      (description.length < 10 || description.length >= 100)
    ) {
      throw new BadRequestException(
        '상품설명은 10자 이상 100자 이내로 작성해주세요',
      );
    }

    if (price !== undefined && (price <= 0 || typeof price !== 'number')) {
      throw new BadRequestException('가격은 1자 이상, 숫자여야 합니다.');
    }

    if (tags !== undefined && !Array.isArray(tags)) {
      throw new BadRequestException('태그는 배열 상태여야 합니다.');
    }

    const update = {};
    if (name) update.name = name;
    if (description) update.description = description;
    if (price) update.price = price;
    if (tags) update.tags = tags;

    const updateItem = await itemRepository.update(itemId, update);

    res.status(200).json({
      success: true,
      data: updateItem,
      message: '상품이 수정되었습니다.',
    });
  } catch (error) {
    next(error);
  }
});

// DELETE 상품 삭제
itemRouter.delete('/:itemId', async (req, res, next) => {
  try {
    const { itemId } = req.params;

    const target = await itemRepository.findById(itemId);
    if (!target) {
      throw new NotFoundException('삭제할 상품을 찾을 수 없습니다.');
    }

    const deleteItem = await itemRepository.remove(itemId);

    res.status(200).json({
      success: true,
      data: deleteItem,
      message: '상품이 삭제되었습니다.',
    });
  } catch (error) {
    next(error);
  }
});

itemRouter.use('/:itemId/comments', productCommentsRouter);
