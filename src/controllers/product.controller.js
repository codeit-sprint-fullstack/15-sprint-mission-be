import { Product } from "../models/product.model.js";

export const createProduct = async (req, res) => {
  const { name, description, price, tags } = req.body;
  const product = await Product.create({ name, description, price, tags });
  res.status(201).json({
    success: true,
    message: "상품이 등록되었습니다.",
    data: product,
  });
};
