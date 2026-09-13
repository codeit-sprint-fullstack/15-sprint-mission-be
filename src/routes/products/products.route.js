import express from 'express';
import mongoose from 'mongoose';
import { Product } from '../../models/product.model.js';
import { BadRequestException } from '../../errors/bad-request-exception.js';
import { NotFoundException } from '../../errors/not-found-exception.js';
import { validateProductPagination } from '../../middlewares/validate-product-pagination.js';
import { validateProductPost } from '../../middlewares/validate-product-post.js';
import { validateProductPatch } from '../../middlewares/validate-product-patch.js';

export const productsRouter = express.Router();

productsRouter.param('productId', (req, res, next, productId) => {
  if (!mongoose.isObjectIdOrHexString(productId)) {
    return next(new BadRequestException('올바른 상품 ID가 아닙니다.'));
  }

  return next();
});

// 상품 목록 호출(검색과 페이지네이션 기능)
productsRouter.get('/', validateProductPagination, async (req, res, next) => {
  try {
    const { page, pageSize, keyword } = req.validatedPagination;
    const filter = keyword
      ? {
          $or: [
            { name: { $regex: keyword, $options: 'i' } },
            { description: { $regex: keyword, $options: 'i' } },
          ],
        }
      : {}; // filter에 값을 할당하는 문법 중 몽구스 전용이라 잘 모르는 부분들은 읽고만 넘어갔습니다: 몽구스 전용 특수 연산자($), $or는 조건 중 하나라도 맞으면 통과, 대소문자 구분 없이 검색(중요, $options: 'i'는 insensitive) 등...
    const skip = (page - 1) * pageSize;

    const [list, totalCount] = await Promise.all([
      Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(pageSize),
      Product.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      data: { list, totalCount },
      message: '상품 목록 호출 성공',
    });
  } catch (error) {
    return next(error);
  }
});

// 개별 상품 호출
productsRouter.get('/:productId', async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.productId);

    if (!product) {
      return next(new NotFoundException('요청하신 상품을 찾을 수 없습니다.'));
    }

    return res.status(200).json({
      success: true,
      data: { product },
      message: '개별 상품 호출 성공',
    });
  } catch (error) {
    return next(error);
  }
});

// 상품 등록
productsRouter.post('/', validateProductPost, async (req, res, next) => {
  try {
    const { name, description, price, tags } = req.body ?? {};
    const newItem = new Product({ name, description, price, tags });
    const savedItem = await newItem.save();

    return res.status(201).json({
      success: true,
      data: { productId: savedItem._id },
      message: '상품 등록 성공',
    });
  } catch (error) {
    return next(error);
  }
});

// 상품 업데이트 : findByIdAndUpdate 메서드를 쓸 때는 { new: true, runValidators: true } 옵션도 세트로!
productsRouter.patch(
  '/:productId',
  validateProductPatch,
  async (req, res, next) => {
    try {
      //   const { name, description, price, tags } = req.body ?? {};
      const product = await Product.findByIdAndUpdate(
        req.params.productId,
        req.body, // 다른 메서드와 달리 req.body를 구조분해하지 않고 그대로 전달 ← 왜냐하면, src/middlewares/validate-patch-products.js에서 언급한 문제에서 파생되는 또다른 문제를 지적받음.
        // 구조분해하여 전달시 실제 업데이트할 속성이 있어도 다른 속성이 undefined일 경우 기존의 유효한 값마저 덮어씌워질 수 있기 때문에, 이렇게 써야 클라이언트가 안 보낸 필드는 키 값 자체가 없어 더 안전하다고 함.
        { new: true, runValidators: true }, // 리턴값을 업데이트된 값으로 하고, 스키마에 맞는지 검증시킴.
      );

      if (!product) {
        return next(
          new NotFoundException('업데이트할 상품을 찾을 수 없습니다.'),
        );
      }

      return res.status(200).json({
        success: true,
        data: { product },
        message: '상품 정보 업데이트 성공',
      });
    } catch (error) {
      return next(error);
    }
  },
);

// 상품 삭제
productsRouter.delete('/:productId', async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.productId);

    if (!product) {
      return next(
        new NotFoundException('삭제하고자 하는 상품을 찾을 수 없습니다.'),
      );
    }

    return res.status(200).json({
      success: true,
      data: { product },
      message: '상품 정보 삭제 성공',
    });
  } catch (error) {
    return next(error);
  }
});
