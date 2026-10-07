import { isDevelopment } from '#config';
import { ERROR_MESSAGES, HTTP_STATUS, PRISMA_ERROR } from '#constants';
import { HttpException, NotFoundException } from '#errors';
import { Prisma } from '#generated/prisma/client.ts';

export const notFoundHandler = (req, res, next) => {
    return next(new NotFoundException('존재하지 않는 경로입니다.'))
}

export const errorHandler = (error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  console.error('error', error);

  if (
    error instanceof SyntaxError &&
    error.status === HTTP_STATUS.BAD_REQUEST
  ) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: '요청 본문이 올바른 JSON 형식이 아닙니다.',
    });
  }

  if (error instanceof HttpException) {
    return res.status(error.statusCode).json({
      ...(error.details ?? {}),
      success: false,
      message: error.message,
    });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case PRISMA_ERROR.UNIQUE_CONSTRAINT: {
        return res.status(HTTP_STATUS.CONFLICT).json({
          success: false,
          message: ERROR_MESSAGES.VALUE_ALREADY_IN_USE,
        });
      }
      case PRISMA_ERROR.RECORD_NOT_FOUND: {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: ERROR_MESSAGES.RESOURCE_NOT_FOUND,
        });
      }
      case PRISMA_ERROR.FOREIGN_KEY_CONSTRAINT: {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: ERROR_MESSAGES.BAD_REQUEST,
        });
      }
    }
  }

  const result = {
    success: false,
    message: 'Internal Server Error',
  };

  if (isDevelopment) {
    result.details = {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
  }

  return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(result);
};
