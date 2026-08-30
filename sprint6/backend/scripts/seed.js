import { faker } from '@faker-js/faker';
import { PrismaClient } from '#generated/prisma/client.ts';
import { PrismaPg } from '@prisma/adapter-pg';
import {
  assertSafeSeedInsertTarget,
  assertSafeSeedTarget,
  resetPandaMarketData,
} from './seed-safety.js';

const NUM_PRODUCTS_TO_CREATE = 10;
const NUM_ARTICLES_TO_CREATE = 10;
const NUM_COMMENTS_PER_PARENT = 3;

const PRODUCT_TAG_POOL = [
  'Best',
  'New',
  'Refurbished',
  'Limited',
  'Free Shipping',
];

const makeProductInput = () => ({
  name: faker.commerce.productName(),
  description: faker.commerce.productDescription(),
  price: faker.number.int({ min: 1000, max: 1000000 }),
  tags: faker.helpers.arrayElements(PRODUCT_TAG_POOL, {
    min: 0,
    max: PRODUCT_TAG_POOL.length,
  }),
});

const makeArticleInput = () => ({
  title: faker.lorem.sentence({ min: 3, max: 8 }),
  content: faker.lorem.paragraphs({ min: 2, max: 5 }, '\n\n'),
});

const makeCommentInput = () => ({
  content: faker.lorem.sentence({ min: 4, max: 10 }),
});

async function seed(prisma) {
  const productData = Array.from(
    { length: NUM_PRODUCTS_TO_CREATE },
    makeProductInput,
  );
  const articleData = Array.from(
    { length: NUM_ARTICLES_TO_CREATE },
    makeArticleInput,
  );

  const products = await prisma.product.createManyAndReturn({
    data: productData,
  });
  const articles = await prisma.article.createManyAndReturn({
    data: articleData,
  });

  const commentData = [];
  for (const product of products) {
    for (let index = 0; index < NUM_COMMENTS_PER_PARENT; index += 1) {
      commentData.push({ ...makeCommentInput(), productId: product.id });
    }
  }
  for (const article of articles) {
    for (let index = 0; index < NUM_COMMENTS_PER_PARENT; index += 1) {
      commentData.push({ ...makeCommentInput(), articleId: article.id });
    }
  }

  await prisma.comment.createMany({ data: commentData });

  return {
    productCount: products.length,
    articleCount: articles.length,
    commentCount: commentData.length,
  };
}

async function main(prisma) {
  const isInsertOnly = process.argv.includes('--no-reset');

  if (!isInsertOnly) {
    assertSafeSeedTarget({
      databaseUrl: process.env.DATABASE_URL,
      nodeEnv: process.env.NODE_ENV,
      args: process.argv,
    });

    await resetPandaMarketData(prisma);
  } else {
    assertSafeSeedInsertTarget({ databaseUrl: process.env.DATABASE_URL });

    const [productCount, articleCount, commentCount] = await Promise.all([
      prisma.product.count(),
      prisma.article.count(),
      prisma.comment.count(),
    ]);

    if (productCount > 0 || articleCount > 0 || commentCount > 0) {
      console.log('이미 시드된 데이터가 있어 건너뜁니다.');
      return;
    }
  }

  const result = await seed(prisma);

  console.log(`${result.productCount}개의 상품이 생성되었습니다.`);
  console.log(`${result.articleCount}개의 게시글이 생성되었습니다.`);
  console.log(`${result.commentCount}개의 댓글이 생성되었습니다.`);
}

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

main(prisma)
  .catch((error) => {
    console.error('시딩 오류:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
