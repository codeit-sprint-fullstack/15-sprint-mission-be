import z from 'zod';

export const createReplySchema = z.object({
  articleId: z.coerce
    .number({
      required_error: '게시글 ID는 필수입니다.',
      invalid_type_error: '게시글 ID는 숫자여야 합니다.',
    })
    .int('게시글 ID는 정수여야 합니다.')
    .positive('게시글 ID는 양수여야 합니다.'),
  content: z
    .string({ required_error: '댓글 내용은 수 필수입력값입니다.' })
    .min(1, '댓글 내용은 최소 1자 이상이어야 합니다.')
    .max(255, '댓글 내용은 255자를 초과할 수 없습니다.'),
});

export const updateReplySchema = z.object({
  content: z
    .string({ required_error: '댓글 내용은 필수 입력값입니다.' })
    .min(1, '댓글 내용은 최소 1자 이상이어야 합니다.')
    .max(255, '댓글 내용은 255자를 초과할 수 없습니다.'),
});

export const getReplyParamsSchema = z.object({
  id: z.coerce
    .number({ invalid_type_error: '댓글 ID는 숫자여야 합니다.' })
    .int('댓글 ID는 정수여야 합니다.')
    .positive('댓글 ID는 양수여야 합니다.'),
});
