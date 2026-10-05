import { z } from 'zod';

export const createCommentSchema = z.object({
  body: z.object({
    content: z.string().min(1, '댓글 내용을 입력해 주세요.'),
  }),
});

export const updateCommentSchema = z.object({
  body: z.object({
    content: z.string().min(1, '수정할 댓글 내용을 입력해 주세요.'),
  }),
});

export const getCommentsSchema = z.object({
  query: z
    .object({
      cursor: z.coerce.number().int().positive().optional(),
      limit: z.coerce.number().int().positive().default(10),
    })
    .default({}),
});

export const commentIdSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive('유효한 댓글 ID가 아닙니다.'),
  }),
});