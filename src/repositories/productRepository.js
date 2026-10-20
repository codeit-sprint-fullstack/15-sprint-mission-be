import { prisma } from '#src/db/prisma.js';

export const createProduct = async (data) => {
  return await prisma.product.create({
    data,
  });
};

export const getProducts = async ({ skip, limit, where, orderBy }) => {
  const [products, totalCount] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  return { products, totalCount };
};

export const getProductById = async (id) => {
  return await prisma.product.findUnique({
    where: { id },
  });
};

export const updateProduct = async (id, data) => {
  return await prisma.product.update({
    where: { id },
    data,
  });
};

export const deleteProduct = async (id) => {
  return await prisma.product.delete({
    where: { id },
  });
};
