//여기는 기능별 route들을 연결하는 허브 역할

import express from 'express';
import { itemRouter } from './Item.route.js';

export const router = express.Router();

//라우터의 기본 동작 확인 -> 요청이 들어왔을 때 응답으로 다음과 같은 문구를 띄운다
router.get('/', (req, res) => {
  res.status(200).json({
    message: 'Hello Panda-market',
    timestamp: new Date().toISOString(),
  });
});

//기능별 router 연결하기 -> item.router
router.use('/items', itemRouter);

