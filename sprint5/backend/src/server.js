import express from 'express';
import cors from 'cors';
import 'dotenv/config';

import { router } from './routes/index.js';
import { errorHandler } from './middlewares/error-handler.js';
import { config } from './config/config.js';
import { connectDB } from './db/index.js';


await connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).send('판다마켓 API 서버가 정상 동작 중입니다.');
});

app.use('/', router);

app.use((req, res) => {
  res.status(404).json({ success: false, message: `요청하신 경로를 찾을 수 없습니다: ${req.originalUrl}` });
});
app.use(errorHandler);

app.listen(config.PORT, () => {
  console.log(`서버가 http://localhost:${config.PORT} 에서 실행 중입니다.`);
});