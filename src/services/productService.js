import * as productRepository from '#src/repositories/productRepository.js';
import { NotFoundException } from '#src/errors/not-found-exception.js';

export const createProduct = async (productData) => {
  return await productRepository.createProduct(productData);
};

export const getProducts = async (query = {}) => {
  const page = Number(query.page) || 1;
  const pageSize = Number(query.pageSize) || 10;
  const { keyword, orderBy = 'recent' } = query;

  const limit = pageSize;
  const skip = (page - 1) * limit;

  const where = {};
  if (keyword) {
    where.OR = [
      { name: { contains: keyword, mode: 'insensitive' } },
      { description: { contains: keyword, mode: 'insensitive' } },
    ];
  }

  const orderByOption = {
    createdAt: orderBy === 'oldest' ? 'asc' : 'desc',
  };

  const { products, totalCount } = await productRepository.getProducts({
    skip,
    limit,
    where,
    orderBy: orderByOption,
  });

  return { list: products, totalCount };
};

export const getProductById = async (id) => {
  const product = await productRepository.getProductById(id);

  if (!product) {
    throw NotFoundException(404, '존재하지 않는 상품입니다.');
  }

  return product;
};

export const updateProduct = async (id, updateData) => {
  await getProductById(id);

  return await productRepository.updateProduct(id, updateData);
};

export const deleteProduct = async (id) => {
  await getProductById(id);

  return await productRepository.deleteProduct(id);
};
