import express from 'express';
import { ProductsRouter } from './products/produc.route.js'

export const rootRouter = express.Router();

rootRouter.get('/',( req, res, next ) => {
  res.status(200).json({
    success: true,
    date: new Date().toISOString(),
    message: 'health check',
  });
});

rootRouter.use('/producrs',ProductsRouter);