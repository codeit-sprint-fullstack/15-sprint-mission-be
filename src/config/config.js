import z from 'zod';
import { flattenError } from 'zod/v4/core';

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().int().min(1000).max(65535).default(5001),
  DATABASE_URL: z
    .string({ required_error: 'DATABASE_URL은 필수 환경 변수입니다.' })
    .regex(
      /^(postgresql|postgres):\/\/.+/,
      "DATABASE_URL은 'postgresql://' 또는 'postgres://' 형식의 올바른 연결 주소여야 합니다.",
    ),
  DIRECT_URL: z
    .string({ required_error: 'DIRECT_URL은 필수 환경 변수입니다.' })
    .regex(
      /^(postgresql|postgres):\/\/.+/,
      "DIRECT_URL은 'postgresql://' 또는 'postgres://' 형식의 올바른 연결 주소여야 합니다.",
    ),
});

const parseEnvironment = () => {
  try {
    return envSchema.parse({
      NODE_ENV: process.env.NODE_ENV,
      PORT: process.env.PORT,
      DATABASE_URL: process.env.DATABASE_URL,
      DIRECT_URL: process.env.DIRECT_URL,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('환경 변수 검증 실패:', flattenError(error));
    }
    throw error;
  }
};

export const config = parseEnvironment();

// 환경별 헬퍼 함수들
export const isDevelopment = config.NODE_ENV === 'development'; // boolean
export const isProduction = config.NODE_ENV === 'production'; // boolean
export const isTest = config.NODE_ENV === 'test'; // boolean
