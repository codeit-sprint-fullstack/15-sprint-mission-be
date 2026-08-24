import express from "express";
import cors from "cors";
import { env } from "./config/env.js";

const app = express();

// 미들웨어 설정
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  }),
);

app.use(express.json());

// 기본 엔드포인트
app.get("/", (req, res) => {
  res.send("Express 서버 시작");
});

// 헬스체크 라우트
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    env: env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

export default app;
