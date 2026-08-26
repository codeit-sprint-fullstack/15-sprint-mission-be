import { HttpException } from './http-exception.js';

export const errorHandler = (err, req, res, next) => {
  //만약에 err이 HttpException으로 만들어진 객체면, 다음과 같은 에러 메세지, 상태코드를 반환하겠다

  if (err instanceof HttpException){
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  } 
  //Edge case error 대응
  return res.status(500).json({
    success: false,
    message: 'Internal Server Error'
  });
};
