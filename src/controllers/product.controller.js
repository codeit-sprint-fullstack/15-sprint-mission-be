import { Product } from "../models/product.model.js";
import { AppError } from "../utils/AppError.js";

export const createProduct = async (req, res) => {
  const { name, description, price, tags } = res.locals.validated.body;

  const product = await Product.create({ name, description, price, tags });

  res.status(201).json({
    success: true,
    message: "상품이 등록되었습니다.",
    data: product,
  });
};

export const getProduct = async (req, res) => {
  const { id } = req.params;

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

  const validatedBody = res.locals.validated.body;

  if (Object.keys(validatedBody).length === 0) {
    throw new AppError("수정할 데이터를 하나 이상 입력해 주세요", 400);
  }

  const product = await Product.findById(id);
  if (!product) {
    throw new AppError("상품을 찾을 수 없습니다", 404);
  }

  Object.assign(product, validatedBody);
  await product.save();

  res.status(200).json({
    success: true,
    message: "상품 수정 성공",
    data: product,
  });
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  const product = await Product.findById(id);
  if (!product) {
    throw new AppError("상품을 찾을 수 없습니다", 404);
  }

  await product.deleteOne();

  res.status(200).json({
    success: true,
    message: "상품 삭제 성공",
    data: null,
  });
};

export const getProducts = async (req, res) => {
  const { page, limit, keyword } = res.locals.validated.query;

  const query = {};
  if (keyword) {
    query.$or = [
      { name: { $regex: keyword, $options: "i" } },
      { description: { $regex: keyword, $options: "i" } },
    ];
  }

  const skip = (page - 1) * limit;

  const products = await Product.find(query)
    .select("id name price createdAt")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalCount = await Product.countDocuments(query);
  const totalPages = Math.ceil(totalCount / limit);

  res.status(200).json({
    success: true,
    message: "상품 목록 조회 성공",
    data: {
      items: products,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
      },
    },
  });
};
