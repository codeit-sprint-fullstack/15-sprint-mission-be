const requiredEnvVars = ["MONGO_URI"];

for (const key of requiredEnvVars) {
  if (!process.env[key]) {
    throw new Error(`[ENV ERROR] 필수 환경변수가 없습니다: ${key}`);
  }
}

export const env = {
  PORT: process.env.PORT || 5001,
  NODE_ENV: process.env.NODE_ENV || "development",
  MONGO_URI: process.env.MONGO_URI,
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",
};
