import express from "express";
import mongoose from "mongoose";
import { z } from "zod";
import { validate } from "../middlewares/validate.middleware.js";
import { AppError } from "../utils/AppError.js";
import * as productController from "../controllers/product.controller.js";

const router = express.Router();

const createSchema = z.object({
  name: z
    .string()
    .min(1, "1자 이상 입력해 주세요")
    .max(10, "10자 이내로 입력해 주세요"),
  description: z
    .string()
    .min(10, "10자 이상 입력해 주세요")
    .max(100, "100자 이내로 입력해 주세요"),
  price: z
    .number({ error: "가격은 숫자로 입력해 주세요" })
    .min(0, "가격은 0원 이상이어야 합니다"),
  tags: z
    .array(z.string().max(5, "5글자 이내로 입력해 주세요"))
    .min(1, "태그를 최소 1개는 추가해 주세요")
    .max(10, "태그는 최대 10개까지만 가능합니다"),
});

const updateSchema = createSchema.partial();

const querySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  keyword: z.string().default(""),
});

// 상품 id 체크
router.param("id", (req, res, next, id) => {
  if (!mongoose.isValidObjectId(id)) {
    return next(new AppError("유효하지 않은 상품 ID입니다", 400));
  }
  next();
});

// 상품 등록
router.post("/", validate(createSchema), productController.createProduct);

// 상품 목록 조회
router.get("/", validate(querySchema, "query"), productController.getProducts);

// 상품 상세 조회
router.get("/:id", productController.getProduct);

// 상품 수정
router.patch("/:id", validate(updateSchema), productController.updateProduct);

// 상품 삭제
router.delete("/:id", productController.deleteProduct);

export default router;
