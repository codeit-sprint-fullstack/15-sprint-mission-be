import express from 'express';
import { router as apiRouter } from './routes/index.js';
import { logger, cors, notFoundHandler, errorHandler } from '#middlewares';

const app = express();


app.use(logger);
app.use(cors);
app.use(express.json());
app.use('/api', apiRouter);
app.use(notFoundHandler)
app.use(errorHandler);
app.listen(process.env.PORT, () => {
  console.log(`Server running at ${process.env.PORT}...`);
});
