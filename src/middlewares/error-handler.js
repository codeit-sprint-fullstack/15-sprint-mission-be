//만든 에러가져오기
import { HttpException } from "../errors/http-exception.js";

export const errorHandler = (error, req, res, _next) => {
  //이 에러가 맞나?
  if (error instanceof HttpException) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  }

  console.log("error", error);

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    
  });
};
