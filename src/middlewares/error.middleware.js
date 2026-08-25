import { AppError } from "../utils/AppError.js";

export const errorHandler = (err, req, res, next) => {
  console.error("🚨 [서버 에러 로그]:", err);

  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof AppError) {
    const responseBody = {
      success: false,
      message: err.message,
    };

    if (err.errorObj) {
      responseBody.errors = err.errorObj;
    }

    return res.status(err.statusCode).json(responseBody);
  }

  return res.status(500).json({
    success: false,
    message: "서버 내부에서 문제가 발생했습니다.",
  });
};

// 404 처리용 미들웨어
export const notFound = (req, res, next) => {
  throw new AppError(`요청한 경로를 찾을 수 없습니다: ${req.originalUrl}`, 404);
};
