import * as productService from '#src/services/productService.js';

export const createProduct = async (req, res) => {
  const newProduct = await productService.createProduct(req.body);
  return res.status(201).json(newProduct);
};

export const getProducts = async (req, res) => {
  const result = await productService.getProducts(req.query);
  return res.status(200).json(result);
};

export const getProductById = async (req, res) => {
  const product = await productService.getProductById(req.params.id);
  return res.status(200).json(product);
};

export const updateProduct = async (req, res) => {
  const updatedProduct = await productService.updateProduct(req.params.id, req.body);
  return res.status(200).json(updatedProduct);
};

export const deleteProduct = async (req, res) => {
  await productService.deleteProduct(req.params.id);
  return res.status(200).json({ message: '상품이 성공적으로 삭제되었습니다.', id: req.params.id });
};