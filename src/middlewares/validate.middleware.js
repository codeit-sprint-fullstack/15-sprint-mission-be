import { AppError } from "../utils/AppError.js";

/**
 * Zod 스키마를 이용한 요청 데이터 검증 미들웨어
 * @param {import('zod').ZodSchema} schema - 검증에 사용할 Zod 스키마
 * @param {"body" | "query" | "params"} [target="body"] - 검증할 객체의 위치 (기본값: "body")
 * @returns {Function} Express 미들웨어 함수
 */
export const validate =
  (schema, target = "body") =>
  (req, res, next) => {
    const result = schema.safeParse(req[target]);

    // 검증 실패
    if (!result.success) {
      const errorObj = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path.join(".");
        errorObj[field] = issue.message;
      });

      return next(
        new AppError(
          `입력값이 검증에 실패했습니다. (${target})`,
          400,
          errorObj,
        ),
      );
    }

    // 검증 성공
    res.locals.validated = res.locals.validated || {};
    res.locals.validated[target] = result.data;
    next();
  };
