import mongoose from 'mongoose';
import { config } from '../config/config.js';

export const connectDB = async () => {
  await mongoose.connect(config.MONGO_URI, { serverSelectionTimeoutMS: 5000 });
  console.log('MongoDB 연결됨');
};
