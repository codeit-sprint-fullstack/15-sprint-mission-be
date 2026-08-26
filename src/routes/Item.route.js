import express from 'express';
import mongoose from 'mongoose';
import { Item } from '../models/item.model.js';
import { BadRequestException } from '../error/Bad-request-excep.js';
import { ConflictException } from '../error/Conflict-excep.js';
import { NotFoundException } from '../error/Not-found-excep.js';

export const itemRouter = express.Router();

//GET 목록 조회
// itemRouter.get('/', async (req, res) => {
//   const itemLists = await Item.find();

//   res.status(200).json({
//     success: true,
//     data: {
//       itemLists,
//     },
//     message: '상품 목록 조회 성공',
//   });
// });

//GET Refactor
itemRouter.get('/', async (req, res, next) => {
  try {
    const {
      page = 1,
      limits = 10,
      orderBy = 'recent',
      keyword = '',
    } = req.query;

    const offset = (Number(page) - 1) * Number(limits);

    const filter = keyword
      ? {
          $or: [
            {
              name: { $regex: keyword, $options: 'i' },
            },
            {
              description: { $regex: keyword, $options: 'i' },
            },
          ],
        }
      : {};

      const sortOption = orderBy === 'recent'?{createdAt: -1}:{};

      const itemLists = await Item.find(filter).
      sort(sortOption).
      skip(offset).
      limit(Number(limits));

      const totalCount = await Item.countDocuments(filter);

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

//GET 상세 조회
itemRouter.get('/:itemId', async (req, res, next) => {
  //응답 파라미터에서 itemId  받아오기
  //req.params.itemId가 유효한 Id 인지 검증하기
  //findById(itemId)가 MongoDB ITEM에 있는지 검증하기

  try {
    const { itemId } = req.params;

    if (!mongoose.isObjectIdOrHexString(itemId)) {
      throw new BadRequestException('잘못된 Id 값입니다.');
    }

    const targetItem = await Item.findById(itemId);

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

//POST 상품 등록
itemRouter.post('/', async (req, res, next) => {
  try {
    const { name, description, price, tags } = req.body ?? {};

    //name 중복 체크 : Item DB에 있는 name과 post할 때 name이 같으면 true
    const exist = await Item.findOne({ name });
    if (exist) {
      throw new ConflictException('동일한 이름의 상품이 존재합니다.');
    }

    //필수요소 체크
    if( !name || !description || price===undefined){
      throw new BadRequestException(
          '상품명, 상세설명, 가격은 필수 항목입니다.',
        );
    }

    //각 항목 형식 체크
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

    if (tags !== undefined) {
      if (!Array.isArray(tags)) {
        throw new BadRequestException('태그는 배열 상태여야 합니다.');
      }
    }
    //상품 등록 진행!
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

//PATCH 상품 수정
itemRouter.patch('/:itemId', async (req, res, next) => {
  try {
    //요청 파라미터에서 갖고온 아이디와 동일한 아이디인 상품을 Item에서 찾고
    //그게 true/false 판단
    //false-> NotFound
    //true-> req.body에 name, description, price가 하나라도 없으면 BadRequest
    //    -> 모두 있으면 수정 (200)

    const { itemId } = req.params;
    const patchItem = await Item.findById(itemId);

    if (!patchItem) {
      throw new NotFoundException('수정할 상품을 찾을 수 없습니다.');
    }

    //검증 과정
    const { name, description, price, tags } = req.body ?? {};

    // if (!name || !description || !price) {
    //   throw new BadRequestException(
    //     '상품명, 상품설명, 가격은 필수 항목입니다.',
    //   );
    // } -> 이거는 수정할 때 무조건 3개 항목을 모두 수정해야된다는 의미
    // 상품 수정할 때 이름, 설명, 가격 중에 하나만 수정 할 수도 있으므로 nosense
    if (name !== undefined) {
      if (name.length <= 0 || name.length > 10) {
        throw new BadRequestException(
          '상품명은 1자 이상 10자 이내로 작성해주세요',
        );
      }
    }

    if (description !== undefined) {
      if (description.length < 10 || description.length >= 100) {
        throw new BadRequestException(
          '상품설명은 10자 이상 100자 이내로 작성해주세요',
        );
      }
    }

    if (price !== undefined) {
      if (price <= 0 || typeof price !== 'number') {
        throw new BadRequestException('가격은 1자 이상, 숫자여야 합니다.');
      }
    }

    if (tags !== undefined) {
      if (!Array.isArray(tags)) {
        throw new BadRequestException();
      }
    }
    //업데이트 하자
    const update = {};
    if (name) {
      update.name = name;
    }
    if (description) {
      update.description = description;
    }
    if (price) {
      update.price = price;
    }
    if (tags) {
      update.tags = tags;
    }
    //MongoDB에 업데이트-> mongoose를 이용해서 업데이트 하는데
    //mongoose에서 지원하는 메소드는 findByIdAndUpdate() 이다.
    //findByIdAndUpdate(수정할 변수, 업데이트내용을담은변수, {반환해라명령:true})
    //{new:true}-> monoose에서 업데이트 된 내용으로 반환해라 라는 의미미 꼭 있어야됨
    const updateItem = await Item.findByIdAndUpdate(itemId, update, {
      new: true,
    });
    res.status(200).json({
      success: true,
      data: updateItem,
      message: '상품이 수정되었습니다.',
    });
  } catch (error) {
    next(error);
  }
});

//DELETE 상품 삭제
itemRouter.delete('/:itemId', async (req, res, next) => {
  try {
    //검색한 id가 Item에 있는지 확인하기
    const { itemId } = req.params;
    const deleteItem = await Item.findByIdAndDelete(itemId);
    if (!deleteItem) {
      throw new NotFoundException('삭제할 상품을 찾을 수 없습니다.');
    }

    res.status(200).json({
      success: true,
      data: deleteItem,
      message: '상품이 삭제되었습니다.',
      //단순히 무엇이 실행되었는지 보여주는 것
    });
  } catch (error) {
    next(error);
  }
});
