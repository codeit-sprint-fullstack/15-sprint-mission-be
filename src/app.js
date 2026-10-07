import express from 'express';
import { cors } from './middlewares/cors.middleware.js';
import { errorHandler } from './middlewares/error-handler.middleware.js';
import { router } from './routes/index.js';

const app = express();

app.use(cors);
app.use(express.json());

app.use('/api', router);

app.get('/', (req, res) => {
  res.send(`server is running`);
});

app.use(errorHandler);
export default app;
