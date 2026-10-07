import { prisma } from '#db/prisma.js';
import { BadRequestException, NotFoundException } from '#errors';

export const validateProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;
    console.log(productId);

    if (!productId) {
      throw new BadRequestException('상품 id가 없습니다');
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('해당 상품을 찾을 수 없습니다');
    }

    next();
  } catch (error) {
    next(error);
  }
};
