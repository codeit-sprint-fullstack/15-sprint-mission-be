import express from 'express';
import { router } from './routes/index.js';
import { cors } from './middlewares/cors.js';
import { config } from './config/config.js';
import { errorHandler } from './middlewares/error-handler.js';

const app = express();
app.use(cors);

app.use(express.json());

app.use('/', router);
app.use(errorHandler);

app.listen(config.PORT, () => {
  console.log(`Server Running ${config.PORT}`);
});
