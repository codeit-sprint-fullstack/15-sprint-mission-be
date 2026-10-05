import { PrismaClient } from '#generated/prisma/client.ts';
import { fakerKO as faker } from '@faker-js/faker';
import { PrismaPg } from '@prisma/adapter-pg';
import { assertSafeSeedTarget, resetAllData } from './seed-safety.js';

const NUM_PRODUCTS_TO_CREATE = 10;
const NUM_ARTICLES_TO_CREATE = 10;

const makeProductInput = () => ({
  name: faker.commerce.productName(),
  description: faker.commerce.productDescription(),
  price: faker.number.int({ min: 1000, max: 500000 }),
  tags: faker.helpers.arrayElements(
    [faker.commerce.department(), faker.commerce.productAdjective()],
    { min: 1, max: 2 },
  ),
  comments: {
    create: Array.from(
      { length: faker.number.int({ min: 0, max: 3 }) },
      () => ({
        content: faker.lorem.sentence(),
      }),
    ),
  },
});

const makeArticleInput = () => ({
  title: faker.lorem.sentence({ min: 2, max: 4 }),
  content: faker.lorem.paragraphs(2),
  comments: {
    create: Array.from(
      { length: faker.number.int({ min: 0, max: 3 }) },
      () => ({
        content: faker.lorem.sentence(),
      }),
    ),
  },
});

async function seed(prisma) {
  const productPromises = Array.from(
    { length: NUM_PRODUCTS_TO_CREATE },
    async () => {
      const data = makeProductInput();
      return await prisma.product.create({
        data: {
          name: data.name,
          description: data.description,
          price: data.price,
          tags: data.tags,
          comments: data.comments,
        },
      });
    },
  );

  const articlePromises = Array.from(
    { length: NUM_ARTICLES_TO_CREATE },
    async () => {
      const data = makeArticleInput();
      return await prisma.article.create({
        data: {
          title: data.title,
          content: data.content,
          comments: data.comments,
        },
      });
    },
  );

  const products = await Promise.all(productPromises);
  const articles = await Promise.all(articlePromises);

  return {
    productCount: products.length,
    articleCount: articles.length,
  };
}

async function main(prisma) {
  assertSafeSeedTarget({
    databaseUrl: process.env.DATABASE_URL,
    nodeEnv: process.env.NODE_ENV,
    args: process.argv,
  });

  await resetAllData(prisma);

  const result = await seed(prisma);

  console.log(
    `성공적으로 시딩되었습니다: 상품 ${result.productCount}개, 게시글 ${result.articleCount}개 (댓글 포함)`,
  );
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
