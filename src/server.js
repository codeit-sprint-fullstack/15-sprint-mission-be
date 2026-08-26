import express from 'express';
import { router } from './routes/index.js';
import { cors } from './middleware/cors.js';
import { errorHandler } from './error/error-handler.js';
import { config } from './config/config.js';
import { connectDB } from './db/index.js';

console.log('1. import ok');
const app = express();
const PORT = config.PORT;

console.log('2. config ok');

//MongoDB 불러오기
await connectDB();

 console.log('3. MongoDB ok');

//기본 미들웨어
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

console.log('4. basic middleware ok');

// 라우트를 미들웨어로 등록
app.use(cors);
app.use('/', router);

console.log('5. router ok');

//에러 미들웨어 등록
app.use(errorHandler);

console.log('6. errorhandler ok');

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
