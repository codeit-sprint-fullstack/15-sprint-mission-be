
import { HttpException } from '../errors/http-exception.js';

export const errorHandler = (error, req, res, _next) => {
  if (error instanceof HttpException) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  }
  if (error.name ==='ValidationError') {
    const message = Object.values(error.errors).map((e) => e.message).join(',');
    return res.status(400).json({ success:false, message });
  }
  if (error.name === 'CastError') {
    return res.status(400).json({ success: false, message: '유효하지 않은 상품 id 형식입니다.'});
    }

    console.error(error);
    res.status(500).json({ success: false, message: '서버 내부 오류가 발생했습니다.' });
  };

