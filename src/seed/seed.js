// seed.js
import mongoose from 'mongoose';
import { config } from '../config/config.js';
import { Product } from '../models/product.model.js';

const seedProducts = async () => {
  try {
    await mongoose.connect(config.MONGO_URI);
    console.log('MongoDB connected');

    const products = [];
    for (let i = 1; i <= 100; i++) {
      products.push({
        name: `상품${i}`,
        description: `상품${i}에 대한 설명입니다.`,
        price: 100 * i,
      });
    }

    await Product.insertMany(products);
    console.log('100개 시딩 완료!');
  } catch (err) {
    console.error('시딩 실패:', err);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB 연결 종료');
  }
};

seedProducts();

// 시딩 코드는 AI에게 요청하여 붙여넣었습니다.
// 터미널에서 node --env-file=env/.env.development src/seed/seed.js 명령어로 실행하였습니다.