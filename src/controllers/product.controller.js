import mongoose from "mongoose";

import { Product } from "../models/product.model.js";
import { AppError } from "../utils/AppError.js";

const checkValidId = (id) => {
  if (!mongoose.isValidObjectId(id)) {
    throw new AppError("유효하지 않은 상품 ID입니다", 400);
  }
};

export const createProduct = async (req, res) => {
  const { name, description, price, tags } = req.body;

  const product = await Product.create({ name, description, price, tags });

  res.status(201).json({
    success: true,
    message: "상품이 등록되었습니다.",
    data: product,
  });
};

export const getProduct = async (req, res) => {
  const { id } = req.params;
  checkValidId(id);

  const product = await Product.findById(id);
  if (!product) {
    throw new AppError("상품을 찾을 수 없습니다", 404);
  }

  res.status(200).json({
    success: true,
    message: "상품 조회 성공",
    data: product,
  });
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  checkValidId(id);

  if (Object.keys(req.body).length === 0) {
    throw new AppError("수정할 데이터를 하나 이상 입력해 주세요", 400);
  }

  const product = await Product.findById(id);
  if (!product) {
    throw new AppError("상품을 찾을 수 없습니다", 404);
  }

  Object.assign(product, req.body);
  await product.save();

  res.status(200).json({
    success: true,
    message: "상품 수정 성공",
    data: product,
  });
};
