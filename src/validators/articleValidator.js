import { z } from 'zod';

export const createArticleSchema = z.object({
  body: z.object({
    title: z
      .string()
      .min(1, '제목을 입력해 주세요.')
      .max(100, '제목은 100자 이내여야 합니다.'),
    content: z.string().min(1, '내용을 입력해 주세요.'),
  }),
});

export const updateArticleSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive('유효한 게시글 ID가 아닙니다.'),
  }),
  body: z.object({
    title: z.string().min(1).max(100).optional(),
    content: z.string().min(1).optional(),
  }),
});

export const getArticlesSchema = z.object({
  query: z
    .object({
      page: z.coerce.number().int().positive().default(1),
      pageSize: z.coerce.number().int().positive().default(10),
      keyword: z.string().optional(),
      orderBy: z.enum(['recent', 'oldest']).default('recent'),
    })
    .default({}),
});

export const getArticleByIdSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive('유효한 게시글 ID가 아닙니다.'),
  }),
});
