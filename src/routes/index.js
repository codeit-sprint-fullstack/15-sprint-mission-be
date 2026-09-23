import express from 'express';
import { productRouter } from './products_route.js';
export const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).send('서버가 정상적으로 실행 중입니다.');
});
router.use('/products', productRouter);
