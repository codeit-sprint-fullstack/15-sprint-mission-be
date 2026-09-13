import { BadRequestException } from '../errors/bad-request-exception.js';
import { z } from 'zod';

const productPostSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(10),
  price: z.coerce.number().int().min(0),
  tags: z.array(z.string()).default([]),   
});

export const validateProductPost = (req, res, next) => {
  try {
    const { name, description, price, tags } = req.body ?? {};
    req.body = productPostSchema.parse({ name, description, price, tags });  // request body를 검증된 값으로 업데이트함.
    return next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(
        new BadRequestException(
          '유효하지 않은 요청입니다. 상품명은 1자 이상, 상품 설명 10자 이상으로 작성해주세요.',
        ),
      );
      return; // 일관성에 걸리지만, return next(new BadReqeustException());로 한 줄로 쓰는 것이 아직 눈에 익지 않아 두 줄로 나누어서 썼습니다.
    }         // ZodError일 경우(검증에 걸리는 경우), 해당 오류내용 전달 후 에러 미들웨어로 넘기고
    return next(error); // ZodError 외의 에러일 경우에도 에러 미들웨어로 전달.
  }
};

// zod로 productSchema를 정의하는 부분에서 각 메서드의 두번째 인자로 오류메세지를 전달할 수 있음을 학습했으나, 실제로 활용하지는 않았습니다.

// validation 미들웨어 2개 이름을 validatePostProductRequestBody, validatePatchProductRequestBody로 지을까 하다가,
// 이름이 너무 긴 것 같아 짧게 표현했는데, 리퀘스트 바디만 검증한다는 부분에서는 긴 이름이 낫지 않았을까 싶습니다.