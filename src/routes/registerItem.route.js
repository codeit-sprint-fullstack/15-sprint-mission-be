import express from 'express';
import { Item } from '../models/item.model.js';
import { HttpException } from '../error/http-exception.js';
import { BadRequestException } from '../error/Bad-request-excep.js';
import { ConflictException } from '../error/Conflict-excep.js';

export const registerItemRouter = express.Router();

registerItemRouter.post('/', async (req, res, next) => {
  try {
    const { name, description, price, tags } = req.body ?? {};

    //name 중복 체크 : Item DB에 있는 name과 post할 때 name이 같으면 true
    const exist = await Item.findOne({ name });

    if (exist) {
      throw new ConflictException('동일한 이름의 상품이 존재합니다.');
    }
    //상품 등록 진행! newItem 배열에 .push
    const newItem = new Item({ name, description, price, tags });
    await newItem.save();

    res.status(201).json({
      success: true,
      data: newItem,
      message: '상품 등록이 완료되었습니다.',
    });
  } catch (error) {
    next(error);
  }
});
