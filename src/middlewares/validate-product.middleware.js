import { BadRequestException } from '#errors';
import { z } from 'zod';

const productPostSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(10).max(200),
  price: z.number().int().min(0),
  tags: z.array(z.string().min(1).max(10)).max(10).default([]),
  images: z.array(z.url()).max(10).default([]),
});

export const validateProductPostBody = (req, res, next) => {
  try {
    req.body = productPostSchema.parse(req.body ?? {});
    return next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new BadRequestException('요청 본문이 올바르지 않습니다.'));
    }
    return next(error);
  }
};

const productPatchSchema = z
  .object({
    name: z.string().min(1).optional(),
    description: z.string().min(10).max(200).optional(),
    price: z.number().int().min(0).optional(),
    tags: z.array(z.string().min(1).max(10)).max(10).optional(),
    images: z.array(z.url()).max(10).optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: '수정할 값이 필요합니다.',
  });

  export const validateProductPatchBody = (req, res, next) => {
  try {
    req.body = productPatchSchema.parse(req.body ?? {});
    return next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new BadRequestException('요청 본문이 올바르지 않습니다.'));
    }
    return next(error);
  }
};