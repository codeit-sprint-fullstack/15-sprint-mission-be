import { z } from 'zod';

export const productIdSchema = z.object({
  params: z.object({
    id: z.coerce
      .number({ invalid_type_error: '유효하지 않은 상품 ID 형식입니다.' })
      .int()
      .positive('ID는 양의 정수여야 합니다.'),
  }),
});

export const createProductSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: '상품명은 필수 항목입니다.' })
      .trim()
      .min(1, '상품명을 입력해 주세요.'),
    price: z
      .number({ required_error: '가격은 필수 항목입니다.' })
      .nonnegative('가격은 0원 이상이어야 합니다.'),
    description: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }),
});

export const updateProductSchema = z.object({
  body: createProductSchema.shape.body
    .partial()
    .refine((data) => Object.keys(data).length > 0, {
      message: '수정할 정보를 최소 하나 이상 입력해 주세요.',
    }),
});

export const getProductsSchema = z.object({
  query: z
    .object({
      page: z.coerce.number().int().positive().default(1),
      pageSize: z.coerce.number().int().positive().default(10),
      keyword: z.string().optional(),
      orderBy: z.enum(['recent', 'oldest']).default('recent'),
    })
    .default({}),
});
