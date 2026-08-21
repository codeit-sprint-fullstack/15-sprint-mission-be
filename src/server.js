import express from 'express';
import { router } from './routes/index.js';
import { logger } from './middlewares/logger.js';
import { config } from './config/config.js';
import { connectDB } from './db/index.js';
import { errorHandler } from './middlewares/error-handler.js';
import cors from 'cors';
import { isDevelopment, isProduction } from './config/config.js';

const app = express();

const developmentAllowedOrigins = ['http://localhost:5173'];
const productionAllowedOrigins = [
  'https://daniel-express-mission5.netlify.app/', // 실제 배포된 프론트엔드 주소로 교체
];

app.use(
  cors({
    origin: (origin, callback) => {
      // 개발 환경: origin 없는 요청(Postman, 서버 간 통신 등) 허용
      if (isDevelopment && !origin) {
        return callback(null, true);
      }

      const allowedOrigins = isDevelopment
        ? developmentAllowedOrigins
        : productionAllowedOrigins;

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      callback(new Error('CORS 정책에 의해 차단됨'));
    },
  }),
);

await connectDB();
app.use(express.json());
app.use(logger);
app.use('/', router);
app.use(errorHandler);

app.listen(config.PORT, () => {
  console.log('Sprint mission 5 Server running');
});
