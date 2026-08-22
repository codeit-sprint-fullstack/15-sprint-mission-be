require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const productRoutes = require('./routes/productRoutes');
const { notFoundHandler, errorHandler } = require('./middlewares/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());


app.use('/products', productRoutes);


app.get('/', (req, res) => {
  res.status(200).send('판다마켓 API 서버가 정상 동작 중입니다.');
});


app.use(notFoundHandler);
app.use(errorHandler);


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB 연결 성공');
    app.listen(PORT, () => {
      console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
    });
  })
  .catch((err) => {
    console.error('MongoDB 연결 실패:', err);
  });
