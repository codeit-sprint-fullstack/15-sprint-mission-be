import express from 'express';
import { productsRouter } from './products.route.js';
import { articleRouter } from './articles.route.js';
import { productCommentRouter } from './productComment.route.js';
import { articleCommentRouter } from './articleComment.route.js';


export const router = express.Router();

router.get('/health-check', (req, res) => {
  res.status(200).json({
    message: 'I am alive!',
    timestamp: new Date().toISOString(),
  });
});

router.use('/products', productsRouter);
router.use('/articles', articleRouter);
router.use('/product-comment', productCommentRouter);
router.use('/article-comment', articleCommentRouter);

