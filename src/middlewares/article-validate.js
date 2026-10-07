import { prisma } from '#db/prisma.js';
import { BadRequestException, NotFoundException } from '#errors';

export const validateArticle = async (req, res, next) => {
  try {
    const { articleId } = req.params;

    if (!articleId) {
      throw new BadRequestException('게시글 id 값이 없습니다.');
    }
    const article = await prisma.article.findUnique({
      where: { id: articleId },
    });

    if (!article) {
      throw new NotFoundException('요청하신 게시글이 존재하지 않습니다.');
    }
    next();
  } catch (error) {
    next(error);
  }
};
