import express from 'express';
import { config } from './config/config.js';
import { connectDB } from './db/index.js';
import { cors } from './middlewares/cors.js';
import { errorHandler } from './middlewares/error-handler.js';
import { logger } from './middlewares/logger.js';
import { rootRouter } from './routes/index.js';

const app = express();

app.use(cors);

app.use(express.json());

app.use(logger);

app.use('/', rootRouter);

app.use(errorHandler);

try {
  await connectDB();

  app.listen(config.PORT, () => {
    console.log(`server running on http://localhost:${config.PORT}....`);
  });
} catch (error) {
  console.error('DB 연결 실패:', error);
  process.exit(1);
}
