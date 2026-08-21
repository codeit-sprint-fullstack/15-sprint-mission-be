import express from 'express';
import { productsRouter } from './products.route.js';

export const router = express.Router();

router.get('/health-check', (req, res) => {
  res.status(200).json({
    message: 'hello express!',
    timestamp: new Date().toISOString(),
  });
});

router.use('/products', productsRouter);
