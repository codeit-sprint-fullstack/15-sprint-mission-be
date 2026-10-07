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

export const getArticleParamsSchema = z.object({
  id: z.coerce
    .number({ invalid_type_error: '게시글 ID는 숫자여야 합니다.' })
    .int('게시글 ID는 정수여야 합니다.')
    .positive('게시글 ID는 양수여야 합니다.'),
});

export const updateArticleSchema = createArticleSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: '수정할 필드(title 또는 content)를 최소 하나 이상 입력해 주세요.',
  });

export const getArticlesQuerySchema = z.object({
  page: z.coerce
    .number({ invalid_type_error: '페이지 번호는 숫자여야 합니다.' })
    .int('페이지 번호는 정수여야 합니다.')
    .positive('페이지 번호는 1 이상이어야 합니다.')
    .default(1),
  pageSize: z.coerce
    .number({ invalid_type_error: '페이지 크기는 숫자여야 합니다.' })
    .int('페이지 크기는 정수여야 합니다.')
    .positive('페이지 크기는 1 이상이어야 합니다.')
    .max(100, '한 번에 최대 100개까지만 조회할 수 있습니다.')
    .default(10),
  orderBy: z
    .enum(['recent'], {
      invalid_type_error: '정렬 방식은 recent만 가능합니다.',
    })
    .default('recent'),
  search: z.string().trim().optional(),
});
