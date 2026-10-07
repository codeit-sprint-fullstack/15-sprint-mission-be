import z from 'zod';

export const createCommentSchema = z
  .object({
    content: z
      .string({ error: '댓글 내용은 필수입니다.' })
      .min(1, '댓글 내용은 필수입니다.')
      .max(200, '댓글은 200자 이하로 작성해주세요.'),
  })
  .strict();

export const updateCommentSchema = createCommentSchema.partial();
