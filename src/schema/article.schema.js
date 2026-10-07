import z from 'zod';

export const createArticleSchema = z
  .object({
    title: z
      .string({ error: '제목은 필수입니다.' })
      .min(1, '제목을 필수입니다.')
      .max(20, '제목은 20자 이하로 작성해주세요.'),
    content: z
      .string({ error: '내용은 필수입니다.' })
      .min(1, '내용은 필수입니다.')
      .max(2000, '내용은 2000자 이하로 설정해주세요'),
  })
  .strict();

export const updateArticleSchema = createArticleSchema.partial();
