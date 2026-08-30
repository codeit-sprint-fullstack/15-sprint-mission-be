import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.coerce.number().default(5001),
  MONGO_URI: z.string({
    error: "MONGO_URI는 필수값입니다",
  }),
  CLIENT_URL: z.string().default("http://localhost:5173"),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error("❌ [ENV ERROR] 환경변수 설정이 잘못되었습니다:");
  result.error.issues.forEach((issue) => {
    console.error(` - ${issue.path.join(".")}: ${issue.message}`);
  });
  process.exit(1);
}

export const env = result.data;
