import { BadRequestException } from '../errors/bad-request-exception.js';

export const validateArticle = (req, res, next) => {
  try {
    const { method } = req;
    const { title, content } = req.body;

    switch (method) {
      case 'PATCH': {
        if (!title && !content) {
          throw new BadRequestException('수정할 데이터를 입력하세요.');
        }
        break;
      }
    }

    next();
  } catch (error) {
    console.log(error);
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  }
};
