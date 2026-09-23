import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production']),
  PORT: z.coerce.number().min(10).max(65535),
  MONGO_URI: z.string(),
});

const parseEnvironment = () => {
  try {
    return envSchema.parse({
      NODE_ENV: process.env.NODE_ENV,
      PORT: process.env.PORT,
      MONGO_URI: process.env.MONGO_URI,
    });
  } catch (error) {
    console.log('error', error);
    throw error;
  }
};

export const config = parseEnvironment();

export const isDevlopment = config.NODE_ENV === 'development';
export const isProduction = config.NODE_ENV === 'production';
