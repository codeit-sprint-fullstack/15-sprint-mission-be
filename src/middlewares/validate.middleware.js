import { AppError } from "../utils/AppError.js";

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
