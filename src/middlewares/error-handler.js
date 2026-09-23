import { HttpException } from '../errors/http-exception.js';

export const errorHandler = (error, _req, res, _next) => {
  if (error instanceof HttpException) {
    return res.status(error.statusCode).json({
      message: error.message,
    });
  }

  res.status(500).json({
    message: 'Internal Server Error',
  });
};
