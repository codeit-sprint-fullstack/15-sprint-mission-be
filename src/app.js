import express from "express";
import cors from "cors";
import productRoutes from "./routes/product.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import { env } from "./config/env.js";

const app = express();

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

// 에러 핸들링
app.use(errorHandler);

export default app;
