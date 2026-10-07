import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production']),
  PORT: z.coerce.number().min(10).max(65535),
  DATABASE_URL: z
    .url()
    .refine(
      (url) => url.startsWith('postgresql:') || url.startsWith('postgres:'),
      'PostgreSQL 연결 URL 이여야 합니다.',
    ),
});

const parseEnvironment = () => {
  try {
    return envSchema.parse({
      NODE_ENV: process.env.NODE_ENV,
      PORT: process.env.PORT,
      DATABASE_URL: process.env.DATABASE_URL,
    });
  } catch (error) {
    console.log('error', error);
    throw error;
  }
};

export const config = parseEnvironment();

export const isDevlopment = config.NODE_ENV === 'development';
export const isProduction = config.NODE_ENV === 'production';
