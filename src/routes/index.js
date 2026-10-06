import express from 'express';

export const router = express.Router();

router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: new Date(),
  });
});
