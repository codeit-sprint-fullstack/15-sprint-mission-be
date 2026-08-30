import { AppError } from "../utils/AppError.js";
import { env } from "../config/env.js";

export const errorHandler = (err, req, res, next) => {
  console.error("🚨 [서버 에러 로그]:", err);

  if (res.headersSent) {
    return next(err);
  }

  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const responseBody = {
    success: false,
    message:
      err instanceof AppError
        ? err.message
        : "서버 내부에서 문제가 발생했습니다.",
  };

  if (err instanceof AppError && err.errorObj) {
    responseBody.errors = err.errorObj;
  }

  // 개발 환경에서만 스택 트레이스를 응답에 포함
  if (env.NODE_ENV !== "production") {
    responseBody.stack = err.stack;
  }

  return res.status(statusCode).json(responseBody);
};

// 404 처리용 미들웨어
export const notFound = (req, res, next) => {
  throw new AppError(`요청한 경로를 찾을 수 없습니다: ${req.originalUrl}`, 404);
};
