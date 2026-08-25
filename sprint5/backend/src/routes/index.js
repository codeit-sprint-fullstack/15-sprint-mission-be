import express from 'express';
import { productsRouter } from './product.route.js';

export const router = express.Router();

router.use('/products', productsRouter);
