import { HttpException } from '../errors/http-exception.js';

export const errorHandler = (error, _req, res, _next) => {
  if (error instanceof HttpException) {
    console.log('from error handler');
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  }

  console.log('error', error.message);
  res.status(500).json({
    success: false,
    message: error.message,
  });
};
