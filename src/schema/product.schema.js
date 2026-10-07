import z from 'zod';

export const createProductSchema = z
  .object({
    name: z
      .string({ error: '상품명은 필수입니다.' })
      .trim()
      .min(1, '상풍명은 필수입니다.')
      .max(12, '상품명을 11자 이하로 작성해주세요.'),
    description: z.string().optional(),
    price: z
      .number()
      .int()
      .min(1, '가격을 1원 이상으로 작성해주세요.')
      .max(10000000, '상품 가격을 10,000,000 미만으로 작성해주세요'),
    tags: z
      .array(z.string().trim().min(1, '태그는 비어있을 수 없습니다.'))
      .min(1, '태그는 필수입니다.')
      .max(5, '태그는 5개까지 가능합니다.'),
  })
  .strict();

export const updateProductSchema = createProductSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: '수정할 내용을 하나 이상 입력해주세요',
  });
