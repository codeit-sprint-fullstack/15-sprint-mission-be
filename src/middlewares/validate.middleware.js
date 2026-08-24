import AppError from "../utils/AppError.js";

export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  // 검증 실패
  if (!result.success) {
    const errorObj = {};
    result.error.issues.forEach((issue) => {
      const field = issue.path.join(".");
      errorObj[field] = issue.message;
    });

    return next(new AppError("입력값이 검증에 실패했습니다.", 400, errorObj));
  }

  // 검증 성공
  req.body = result.data;
  next();
};
