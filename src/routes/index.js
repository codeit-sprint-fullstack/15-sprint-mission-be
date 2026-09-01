import express from "express";
//상품라우터 가져오기
import { productsRouter } from "./products.route.js";
//여러 라우터 모아줄 라우터만들기
export const router = express.Router();

//서버 살아있는지 확인하는 주소
router.get("/health-check", (req, res) => {
  res.status(200).json({
    message: "hi express",
    timestamp: new Date().toISOString(),
  });
});

router.use("/products", productsRouter);
