import dotenv from "dotenv";
import path from "path";
import { flattenError, z } from "zod";

const envMode = process.env.NODE_ENV || "development";
dotenv.config({
  path: path.resolve(process.cwd(), `env/.env.${envMode}`),
});

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.coerce.number().int().min(1000).max(65535).default(5001),
});

const parseEnvironment = () => {
  try {
    return envSchema.parse({
      NODE_ENV: process.env.NODE_ENV,
      PORT: process.env.PORT,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("환경 변수 검증 실패:", flattenError(error));
    }
    throw error;
  }
};

export const config = parseEnvironment();

// 환경별 헬퍼 함수들
export const isDevelopment = config.NODE_ENV === "development"; // boolean
export const isProduction = config.NODE_ENV === "production"; // boolean
export const isTest = config.NODE_ENV === "test"; // boolean
