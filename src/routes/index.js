import express from 'express';
import { productRouter } from './products.routes.js';
import { articleRouter } from './article.routes.js';
import { commentRouter } from './comment.routes.js';
export const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'health check' });
});

router.use('/products', productRouter);
router.use('/articles', articleRouter);
router.use('/comments', commentRouter);
