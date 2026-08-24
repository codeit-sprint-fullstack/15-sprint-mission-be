import express from "express";
import { z } from "zod";
import { validate } from "../middlewares/validate.middleware.js";
import * as productController from "../controllers/product.controller.js";

const router = express.Router();

const createSchema = z.object({
  name: z
    .string()
    .min(1, { message: "1자 이상 입력해 주세요" })
    .max(10, { message: "10자 이내로 입력해 주세요" }),
  description: z
    .string()
    .min(10, { message: "10자 이상 입력해 주세요" })
    .max(100, { message: "100자 이내로 입력해 주세요" }),
  price: z
    .number({
      error: "가격은 숫자로 입력해 주세요",
    })
    .min(0, {
      message: "가격은 0원 이상이어야 합니다",
    }),
  tags: z
    .array(z.string().max(5, { message: "5글자 이내로 입력해 주세요" }))
    .min(1, { message: "태그를 최소 1개는 추가해 주세요" })
    .max(10, { message: "태그는 최대 10개까지만 가능합니다" }),
});

router.post("/", validate(createSchema), productController.createProduct);

export default router;
