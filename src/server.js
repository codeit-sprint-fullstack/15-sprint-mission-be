import express from 'express';
import { rootRouter } from './routes/index.js';
import { cors } from './middlewares/cors.middleware.js';
import { connectDB } from './db/index.js';
import { errorHandler } from './middlewares/error-handler.middleware.js';


const app = express();
const PORT = process.env.PORT


app.use(cors);
app.use(express.json());

app.use('/',rootRouter);

app.use(errorHandler);

await connectDB();

// 서버 시작
app.listen(PORT, () => {
  console.log(`Server is runnning http://localhost:${PORT}`);
});