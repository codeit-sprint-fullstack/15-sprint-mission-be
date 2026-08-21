import { BadRequestException } from '../errors/bad-request-exception.js';

export const validateProduct = (req, res, next) => {
  try {
    const { method } = req;
    const { name, descriotion, price, tags, img } = req.body;

    switch (method) {
      case 'POST': {
        if (!name || !price) {
          throw new BadRequestException('이름과 금액은 필수 입니다.');
        }
        break;
      }
      case 'PATCH': {
        if (!name && !descriotion && !price && !tags && !img) {
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
