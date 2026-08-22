const CustomError = require('./CustomError');


function notFoundHandler(req, res, next) {
  next(new CustomError(404, `요청하신 경로를 찾을 수 없습니다: ${req.originalUrl}`));
}


function errorHandler(err, req, res, next) {
  
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ');
    return res.status(400).json({ message });
  }

  
  if (err.name === 'CastError') {
    return res.status(400).json({ message: '유효하지 않은 상품 id 형식입니다.' });
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || '서버 내부 오류가 발생했습니다.';

  if (statusCode === 500) {
    console.error(err);
  }

  res.status(statusCode).json({ message });
}

module.exports = { notFoundHandler, errorHandler };
