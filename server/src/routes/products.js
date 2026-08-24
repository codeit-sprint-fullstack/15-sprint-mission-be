//1. 필요한 라이브러리와 Product 모델 가져오기
import express from 'express';
import Product from '../models/Product.js';
import mongoose from 'mongoose';

//상품 관련 API 경로를 모아둘 Router
//2. 상품 API를 관리할 라우터 생성
const productsRouter = express.Router();

//10.URL의 상품 ID를 이용해 상품 한 개를 조회
// URL의 상품 ID를 이용해 상품 한 개를 조회합니다.
productsRouter.get('/:id', async (req, res) => {
  //11. id형식 검사 (이 검사를 먼저 하면 잘못된 ID가 findById()에 전달되어 Mongoose 오류가 발생하는 것을 막습니다.)
  if (!mongoose.isObjectIdOrHexString(req.params.id)) {
    return res.status(400).json({
      message: '올바르지 않은 상품 ID 입니다.',
    });
  }

  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({
      message: '상품을 찾을 수 없습니다.',
    });
  }

  res.status(200).json({
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    tags: product.tags,
    createdAt: product.createdAt,
  });
});

//12. 전달된 가격만 수정하고 수정된 상품을 반환
productsRouter.patch('/:id', async (req, res) => {
  if (!mongoose.isObjectIdOrHexString(req.params.id)) {
    return res.status(400).json({
      message: '올바르지 않은 상품ID 입니다.',
    });
  }

  //13. patch를 네 가지 허용 필드로 확장
  const { name, description, price, tags } = req.body ?? {};
  const updates = {};

  if (name !== undefined) {
    updates.name = name;
  }

  if (description !== undefined) {
    updates.description = description;
  }

  if (price !== undefined) {
    updates.price = price;
  }

  if (tags !== undefined) {
    updates.tags = tags;
  }

  //14. PATCH 입력값 검증
  if (Object.keys(updates).length === 0) {
    return res.status(400).json({
      message: '수정할 상품 정보를 입력해주세요.',
    });
  }

  //15. PATCH에 포함된 값의 자료형과 빈 내용을 검사
  const hasInvalidUpdate =
    (name !== undefined && (typeof name !== 'string' || name.trim() === '')) ||
    (description !== undefined &&
      (typeof description !== 'string' || description.trim() === '')) ||
    (price !== undefined &&
      (typeof price !== 'number' || !Number.isFinite(price))) ||
    (tags !== undefined &&
      (!Array.isArray(tags) ||
        tags.length === 0 ||
        tags.some((tag) => typeof tag !== 'string' || tag.trim() === '')));

  if (hasInvalidUpdate) {
    return res.status(400).json({
      message: '입력값의 형식이 올바르지 않습니다.',
    });
  }

  const product = await Product.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    return res.status(404).json({
      message: '상품을 찾을 수 없습니다.',
    });
  }

  res.status(200).json({
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    tags: product.tags,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  });
});

//요청 본문의 상품 정보를 MogoDB에 저장
//3. POST/api/products 요청 처리 함수 등록
productsRouter.post('/', async (req, res) => {
  // 4. 요청 본문에서 상품 정보 꺼내기
  const { name, description, price, tags } = req.body ?? {}; //??{} 요청 본문 자체가 없어도 구조 분해 과정에서 서버가 중단되지 않게 해줌
  //5. 필수값 누락검사 (필수 필드가 빠졌는지 검사)
  if (
    name === undefined ||
    description === undefined ||
    price === undefined ||
    tags === undefined
  ) {
    return res.status(400).json({
      message: 'name, description, price, tags는 필수입니다.',
    });
  }

  //필드 자료형과 빈 내용 검사
  // 6. 각 필드의 자료형과 빈 내용 검사
  const hasInvalidValue =
    typeof name !== 'string' ||
    name.trim() === '' ||
    typeof description !== 'string' ||
    description.trim() === '' ||
    typeof price !== 'number' ||
    !Number.isFinite(price) || //유한한 숫자인지
    !Array.isArray(tags) ||
    tags.length === 0 ||
    tags.some((tag) => typeof tag !== 'string' || tag.trim() === '');

  if (hasInvalidValue) {
    return res.status(400).json({
      message: '입력값의 형식이 올바르지 않습니다.',
    });
  }

  // 7. 검사를 통과한 상품을 MongoDB에 저장
  const product = await Product.create({
    name,
    description,
    price,
    tags,
  });

  //8. 저장된 상품을 201 상태 코드와 JSON으로 응답
  res.status(201).json({
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    tags: product.tags,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  });
});

//9. server.js에서 사용할 수 있도록 Router 내보내기
export default productsRouter;
