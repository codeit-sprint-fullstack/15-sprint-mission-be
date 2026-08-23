import express from "express";
import cors from "cors";

const app = express();

// 미들웨어 설정
app.use(cors());
app.use(express.json());

// 기본 엔드포인트
app.get("/", (req, res) => {
  res.send("Express 서버 시작");
});

export default app;
