//허용하는 도메인을 정하는 미들웨어
// import { }

import { isDevelopment, isProduction } from '../config/config.js';

export const cors = (req, res, next) => {
  //개발 환경일때 -> case 1
  //테스트용 FE 사이트 url만 통과시키면 됨
  const whiteList = isDevelopment ? ['http://localhost:5173'] : [];
  //whiteList배여 : 밑에서 배열 메소드인 includes를 쓰려고 배열로 담는다.

  //테스트용 postman이 통과 할 수 있도록 origin에 대한 검증 과정(postman은 origin이 없음)
  const origin = req.get('origin');
  res.vary('origin');

  //origin이 없고(postman테스트), 개발 환경변수면 그냥 통과!
  if (!origin && isDevelopment) {
    return next();
  }

  //실제 운영환경일때 -> case 2
  //조건: 운영환경인데, origin이 없는 경우 -> 에러
  if (isProduction && !whiteList.includes(origin)) {
    return res.status(403).json({
      success: false,
      message: '허용되지 않는 츌처입니다.',
    });
  }

  //응답헤더 작성 구간
  res.header('Access-Control-Allow-Origin', origin);
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, DELETE, OPTIONS',
  );
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  //서버가 살아있는지 확인하기 위함 용
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
};
