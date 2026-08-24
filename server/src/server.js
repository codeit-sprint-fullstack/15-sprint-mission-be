//1. 환경 변수와 외부 라이브러리
import mongoose from 'mongoose';
import 'dotenv/config';
import cors from 'cors';
import express from 'express';
//2. 프로젝트 내부 모듈
import productsRouter from './routes/products.js';

//3. express 앱과 환경 설정값
const app = express();
const PORT = Number(process.env.PORT) || 3001;

//4. 모든 요청에 공통으로 적용할 미들웨어
//지정한 프론트 엔드 주소에서 오는 브라우저 요청 허용
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000' }));

//json을 js로 변환
app.use(express.json());
//api/products로 들어오는 요청을 상품 Router에 전달
//이후 products.js 안에서 / 경로를 만들면 실제 전체 주소는 /api/products가 됨
app.use('/api/products', productsRouter);

//4. 각 API경로
app.get('/', (req, res) => {
  res
    .status(200)
    .json({ message: '서버가 정상적으로 작동 중입니다.', path: req.path });
});

//공통 오류 처리 확인 후 제거할 임시 경로
// app.get('/error-test', () => {
//   throw new Error('오류 처리 테스트');
// });

//공통 오류처리기 추가
//처리되지 않은 오유를 일관된 json응답으로 반환
app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }

  console.error(`${req.method} ${req.originalUrl}`, error);

  return res.status(500).json({
    message: '서버 오류가 발생했습니다.',
  });
});

//6. mongoDB 연결 성공 시 express 서버 시작
async function startServer() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB 연결 성공');

    app.listen(PORT, () => {
      console.log(`서버가 ${PORT}포트에서 작동 중입니다.`);
    });
  } catch (error) {
    console.error('mongoDB 연결 실패:', error.message);
    process.exit(1);
  }
}

//7. 위에서 만든 시작 함수 실행
startServer();
