import { HttpException } from '../errors/http-exception.js';

// 오류 발생시 catch문에서 받아 next(error);로 전달한 경우, 가장 가까운 에러처리 미들웨어로 넘어가게 된다.
// 이 프로젝트에서 에러처리 미들웨어는 errorHandler 하나이므로 next(error)로 넘긴 오류는 모두 이곳을 거쳐간다.
// statusCode와 에러 메세지 출력을 이 미들웨어 하나로 관리할 수 있다.

export const errorHandler = (error, _req, res, _next) => {
  //에러처리 미들웨어로 만들려면 인자를 무조건 4개 받아야 한다. 사용하지 않는 파라미터도 자리를 채우기 위해 넣어준다.
  if (error instanceof HttpException) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  }

  return res.status(500).json({
    // 필수는 아니지만, 일관성을 위해 마지막 응답부분에도 return을 넣어줬다.
    success: false,
    message: 'Internal Server Error', // Http 오류에서 다루지 않은 기타 오류들은 서버 오류라고 응답한다.
  });
};
