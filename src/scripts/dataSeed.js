// src/scripts/seed.js
import mongoose from 'mongoose';
import { config } from '../config/config.js';
import { Item } from '../models/item.model.js';

const sampleNames = ['카메라', '노트북', '책상', '자전거', '키보드', '모니터', '의자', '스피커'];
const sampleTags = ['빈티지', '중고', '신상', '인기', '한정판', '세일'];

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomTags() {
  const count = Math.floor(Math.random() * 3) + 1; // 1~3개
  const tags = [];
  for (let i = 0; i < count; i++) {
    tags.push(getRandomElement(sampleTags));
  }
  return tags;
}

async function seed() {
  try {
    await mongoose.connect(config.MONGO_URI);
    console.log('MongoDB 연결 성공');

    const dummyItems = Array.from({ length: 25 }, (_, i) => ({
      name: `${getRandomElement(sampleNames)} ${i + 1}`,
      description: `이것은 ${i + 1}번째 무작위 생성된 상품 설명입니다.`,
      price: Math.floor(Math.random() * 500000) + 10000, // 10,000 ~ 510,000원
      tags: getRandomTags(),
    }));

    await Item.insertMany(dummyItems); // 여러 개를 한 번에 삽입
    console.log(`${dummyItems.length}개의 더미 데이터 생성 완료!`);

    process.exit(0);
  } catch (error) {
    console.error('시드 실패:', error);
    process.exit(1);
  }
}

seed();