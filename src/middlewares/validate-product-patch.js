import { BadRequestException } from '../errors/bad-request-exception.js';
import { z } from 'zod';

const productPatchSchema = z
  .object({
    name: z.string().min(1),
    description: z.string().min(10),
    price: z.coerce.number().int().min(0),
    tags: z.array(z.string()).default([]),
  })
  .partial();

export const validateProductPatch = (req, res, next) => {
  try {
    const { name, description, price, tags } = req.body ?? {};
    req.body = productPatchSchema.parse({ name, description, price, tags });  // request body를 검증된 값으로 업데이트함.
    return next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(
        new BadRequestException(
          '유효하지 않은 요청입니다. 상품명은 1자 이상, 상품 설명은 10자 이상으로 작성해주세요.',
        ),
      );
      return; // 일관성에 걸리지만, return next(new BadReqeustException());로 한 줄로 쓰는 것이 아직 눈에 익지 않아 두 줄로 나누어서 썼습니다.
    } // ZodError일 경우(검증에 걸리는 경우), 해당 오류내용 전달 후 에러 미들웨어로 넘기고
    return next(error); // ZodError 외의 에러일 경우에도 에러 미들웨어로 전달.
  }
};

// zod를 사용해보려고 했는데 기본 검증코드 작성후 post와 patch 기능에 동일하게 적용하려고 하니, 
// post에는 name, description, price 모든 필드가 필수이지만 patch는 부분적인 업데이트가 가능하고 기준이 다르게 적용되어야 함을 AI를 통해 학습함.
// post와 patch용 검증 로직을 분기시키고 patch용 검증 로직에만 partial()을 추가하여 모든 필드를 optional하게 바꿈.

// 이로 인해 빈 객체를 업데이트할 수도 있다는 한계점을 발견하고 AI를 통해 .refine()을 통한 검증 규칙 추가가 가능함을 학습하였으나,
// .refine()을 써서 객체의 key들의 length를 체크하여도 tags 필드의 .default([]) 옵션으로 인해 zod 버전에 따라 무산될 수도 있다는 점을 지적받고,
// 부분적인 업데이트가 가능하면서도 빈 객체를 전달하는 것을 방지하려면 if문과 zod를 복합적으로 사용해야 함을 학습함.
// 지금 수준에서는 post와 patch용 검증 로직을 분화하고 patch용 로직에는 .partial()을 적용하는 것 까지만 실행하였습니다..