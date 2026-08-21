import express from 'express';
import { router } from './routes/index.js';
import { logger } from './middlewares/logger.js';
import { config } from './config/config.js';
import { connectDB } from './db/index.js';
import { errorHandler } from './middlewares/error-handler.js';
import cors from 'cors';
import { isDevelopment, isProduction } from './config/config.js';

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      if (isDevelopment && !origin) {
        return callback(null, true);
      }

      const developmentAllowedOrigins = ['http://localhost:5173'];
      if (isDevelopment && developmentAllowedOrigins.includes(origin)) {
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
  console.log(
    `Sprint mission 5 Server running on http://localhost:${config.PORT}`,
  );
});
