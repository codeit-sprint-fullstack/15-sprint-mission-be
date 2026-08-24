import app from "./app.js";
import connectDB from "./config/db.js";
import { env } from "./config/env.js";

const startServer = async () => {
  await connectDB();
  app.listen(env.PORT, () => {
    if (env.NODE_ENV === "production") {
      console.log(`🚀 운영 서버: 포트 ${env.PORT}에서 실행 중`);
    } else {
      console.log(`🚀 로컬 개발 서버: http://localhost:${env.PORT}`);
    }
  });
};

startServer();

process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Rejection:", err.message);
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err.message);
  process.exit(1);
});
