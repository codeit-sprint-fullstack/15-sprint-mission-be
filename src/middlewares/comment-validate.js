import { prisma } from '#db/prisma.js';
import { BadRequestException, NotFoundException } from '#errors';

export const validateComment = async (req, res, next) => {
  try {
    const { commentId, articleId, productId } = req.params;

    if (!commentId) {
      throw new BadRequestException('댓글 id가 없습니다.');
    }

    if (!articleId && !productId) {
      throw new BadRequestException('상품 id 혹은 게시글 id가 없습니다.');
    }

    const comment = await prisma.comment.findUnique({
      where: { id: commentId, ...(productId ? { productId } : { articleId }) },
    });

    if (!comment) {
      throw new NotFoundException('해당 댓글을 찾지 못했습니다.');
    }
    next();
  } catch (error) {
    next(error);
  }
};
