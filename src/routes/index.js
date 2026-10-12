import express from 'express';
import { articleReplyRoute } from './article-reply.route.js';
import { articleRoute } from './article.route.js';

export const router = express.Router();

router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: new Date(),
  });
});

router.use('/articles', articleRoute);
router.use('/article-replies', articleReplyRoute);
