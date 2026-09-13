import express from 'express';
import { productsRouter } from './products/products.route.js';

export const rootRouter = express.Router();

// health check용 기본 라우터
rootRouter.get('/', (req, res, _next) => {
  res.status(200).json({
    success: true,
    data: {},
    timestamp: new Date().toISOString(),
    message: 'health check 완료',
  });
});

rootRouter.use('/products', productsRouter);