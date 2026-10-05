import express from 'express';
import productRouter from '#src/routes/productRouter.js';
import articleRouter from '#src/routes/articleRouter.js';
import { config } from '#src/config/config.js';
import { prisma } from '#src/db/prisma.js';
import { errorHandler } from '#src/middlewares/error-handler.js';

const app = express();
app.use(express.json());

app.use('/products', productRouter);
app.use('/articles', articleRouter);

app.use(errorHandler);

try {
  await prisma.$connect();
  console.log('PostgreSQL 연결 성공!');
} catch (err) {
  console.error('PostgreSQL 연결 실패:', err);
  process.exit(1);
}

app.listen(config.PORT, () => {
  console.log(`Server listening on port http://localhost:${config.PORT}`);
});
