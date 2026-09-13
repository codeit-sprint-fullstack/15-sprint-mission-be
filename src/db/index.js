import mongoose from 'mongoose';
import { config } from '../config/config.js';

// db폴더의 index.js에서는 DB에 실제로 연결시키는 함수를 만든다.
export const connectDB = async () => {
  // 비동기 함수로 선언하고,
  await mongoose.connect(config.MONGO_URI); // 내 몽고DB URI값을 주고 연결시키도록 하고,
  console.log('MongoDB connected'); // 연결이 완전히 끝나면 콘솔에 찍는다.
};
