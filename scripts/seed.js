import { faker } from '@faker-js/faker';
import { PrismaClient } from '#generated/prisma/client.ts';
import { PrismaPg } from '@prisma/adapter-pg';
import { assertSafeSeedTarget, resetMarketData } from './seed-safety.js';

const NUM_PRODUCT_TO_CREATE = 30;
const NUM_ARTICLE_TO_CREATE = 30;

const makeProductInput = () => ({
  name: faker.lorem.sentence({ min: 3, max: 8 }),
  description: faker.lorem.paragraphs({ min: 2, max: 5 }, '\n\n'),
  price: faker.number.int({ min: 1000, max: 900000 }),
  tags: faker.helpers.multiple(() => faker.word.sample(), { count: 2 }),
  img: 'https://loremflickr.com/250/250/tech',
});

const makeArticleInput = () => ({
  title: faker.lorem.sentence({ min: 3, max: 8 }),
  content: faker.lorem.paragraphs({ min: 2, max: 5 }, '\n\n'),
});

const makeCommentInput = (authorId) => ({
  content: faker.lorem.paragraphs({ min: 2, max: 5 }, '\n\n'),
  authorId,
});

async function seed(prisma) {
  const productData = Array.from({ length: NUM_PRODUCT_TO_CREATE }, () =>
    makeProductInput(),
  );
  const articleData = Array.from({ length: NUM_ARTICLE_TO_CREATE }, () =>
    makeArticleInput(),
  );

  await prisma.product.createMany({ data: productData });
  await prisma.article.createMany({ data: articleData });

  const products = await prisma.product.findMany({
    select: { id: true },
  });
  const articles = await prisma.article.findMany({
    select: { id: true },
  });

  const productCommentData = [];
  for (const product of products) {
    const count = faker.number.int({ min: 1, max: 3 });
    for (let index = 0; index < count; index += 1) {
      productCommentData.push(makeCommentInput(product.id));
    }
  }

  const articleCommentData = [];
  for (const article of articles) {
    const count = faker.number.int({ min: 1, max: 3 });
    for (let index = 0; index < count; index += 1) {
      articleCommentData.push(makeCommentInput(article.id));
    }
  }

  await prisma.productComment.createMany({ data: productCommentData });
  await prisma.articleComment.createMany({ data: articleCommentData });

  return {
    productCount: productData.length,
    articleCount: articleData.length,
    productCommentCount: productCommentData.length,
    articleCommentCount: articleCommentData.length,
  };
}

async function main(prisma) {
  assertSafeSeedTarget({
    databaseUrl: process.env.DATABASE_URL,
    nodeEnv: process.env.NODE_ENV,
    args: process.argv,
  });

  await resetMarketData(prisma);
  const result = await seed(prisma);

  console.log(`${result.productCount}개의 제품이 생성되었습니다.`);
  console.log(`${result.articleCount}개의 게시글이 생성되었습니다.`);
  console.log(`${result.productCommentCount}개의 제품 댓글이 생성되었습니다.`);
  console.log(`${result.articleCommentCount}개의 게시글 댓글이 생성되었습니다.`);
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
