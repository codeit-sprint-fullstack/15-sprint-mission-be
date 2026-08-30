import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import productRoutes from "./routes/product.routes.js";
import { errorHandler, notFound } from "./middlewares/error.middleware.js";
import { env } from "./config/env.js";

const app = express();

// 보안 헤더
app.use(helmet());

// 로깅
app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));

// cors
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  }),
);

// json 파싱
app.use(express.json());

// 헬스체크 라우트
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    env: env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// API 라우터 등록
app.use("/api/products", productRoutes);

// API 주소가 없는 경우의 처리
app.use(notFound);

// 에러 핸들링
app.use(errorHandler);

export default app;
