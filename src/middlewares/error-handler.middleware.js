export const errorHandler = (error, req, res, next) => {
  const statusCode = error.name === 'CastError' 
      ? 400 
      : error.statusCode || 500;
  const message =
    error.name === 'CastError'
      ? '유효하지 않은 id 형식입니다.'
      : error.message || '서버이슈';
  res.status(statusCode).json({ success: false, message });
};
