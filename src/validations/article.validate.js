import z from 'zod';

export const createArticleSchema = z.object({
  title: z
    .string({ required_error: '제목은 필수 입력값입니다.' })
    .min(1, '제목은 최소 1자 이상이어야 합니다.')
    .max(255, '제목은 255자를 초과할 수 없습니다.'),
  content: z
    .string({ required_error: '내용은 필수 업력값입니다.' })
    .min(1, '내용은 최소 1자 이상이어야 합니다.')
    .max(255, '내용은 255자를 초과할 수 없습니다.'),
});
