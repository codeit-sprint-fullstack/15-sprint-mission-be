import cors from 'cors';
import express from 'express';
import { config } from '#config';
import { errorHandler } from '#middlewares';
import { router as apiRouter } from '#routes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', apiRouter);

app.use(errorHandler);

app.listen(config.PORT, () => {
  console.log(
    `[${config.NODE_ENV}] Server running at http://localhost:${config.PORT}`,
  );
});
