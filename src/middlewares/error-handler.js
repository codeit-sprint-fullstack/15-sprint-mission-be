import { HttpException } from "../errors/http-exception.js";

export const errorHandler = (error, _req, res, _next) => {
  console.error("error", error);

  if (error instanceof SyntaxError && error.status === 400) {
    return res.status(400).json({
      success: false,
      message: "요청 본문이 올바른 JSON 형식이 아닙니다.",
    });
  }

  if (error instanceof HttpException) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  }

  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
};