import express from 'express';
import { router } from './routes/index.js';
import { logger } from './middlewares/logger.js';
import { config } from './config/config.js';
import { connectDB } from './db/index.js';
import { errorHandler } from './middlewares/error-handler.js';
import cors from 'cors';
//import { isDevelopment, isProduction } from './config/config.js';

const app = express();

const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      console.log('요청 origin:', origin);
      console.log('허용 목록:', allowedOrigins);
      if (!origin) {
        // Postman, 서버-to-서버 요청 등 origin이 없는 경우
        return callback(null, true);
      }

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
