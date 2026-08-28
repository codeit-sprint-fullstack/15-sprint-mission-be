import express from 'express';
import { router } from './routes/index.js';
import { logger } from './middlewares/logger.js';
import { config } from './config/config.js';
import { errorHandler } from './middlewares/error-handler.js';
import cors from 'cors';
//import { isDevelopment, isProduction } from './config/config.js';

const app = express();
const allowedOrigins = process.env.ALLOWED_ORIGINS
  .split(',')
  .map((origin) => origin.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      console.log('요청 origin:', origin);
      console.log('허용 목록:', allowedOrigins);
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      callback(new Error('CORS 정책에 의해 차단됨'));
    },
  }),
);

app.use(express.json());
app.use(logger);
app.use('/', router);
app.use(errorHandler);

app.listen(config.PORT, () => {
  console.log(
    `[${config.NODE_ENV}] Server running at http://localhost:${config.PORT}`,
  );
});
