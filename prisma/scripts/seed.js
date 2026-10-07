import { faker, fakerKO } from '@faker-js/faker';
import { assertSafeSeedTarget, resetMarketData } from './seed-safety.js';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '#generated/prisma/client.ts';
const NUM_CREATE = 10;
const PRODUCT_TAGS = [
  '가구',
  '전자기기',
  '의류',
  '도서',
  '생활용품',
  '중고',
  '미개봉',
  '무료배송',
];

const makeProductInput = () => ({
  name: fakerKO.person.fullName(),
  description: fakerKO.lorem.paragraphs({ min: 10, max: 20 }, '\n\n'),
  tags: faker.helpers.arrayElements(PRODUCT_TAGS, { min: 0, max: 5 }),
  price: faker.number.int({ min: 100, max: 10000000 }),
});

const makeArticleInput = () => ({
  title: fakerKO.lorem.sentence({ min: 5, max: 10 }),
  content: fakerKO.lorem.paragraphs({ min: 10, max: 20 }),
});

const makeCommentsInput = (articleId = null, productId = null) => ({
  content: fakerKO.lorem.sentence({ min: 8, max: 20 }),
  articleId,
  productId,
});

async function seed(prisma) {
  const products = Array.from({ length: NUM_CREATE }, () => makeProductInput());

  const articles = Array.from(
    {
      length: NUM_CREATE,
    },
    () => makeArticleInput(),
  );

  await prisma.product.createMany({
    data: products,
  });

  const saveArticles = await prisma.article.createManyAndReturn({
    data: articles,
    select: { id: true },
  });
  const saveProducts = await prisma.product.createManyAndReturn({
    data: products,
    select: { id: true },
  });

  const comments = [
    ...saveArticles.map((article) => makeCommentsInput(article.id)),
    ...saveProducts.map((product) => makeCommentsInput(null, product.id)),
  ];

  await prisma.comment.createMany({
    data: comments,
  });
}

async function main(prisma) {
  assertSafeSeedTarget({
    databaseUrl: process.env.DATABASE_URL,
    nodeEnv: process.env.NODE_ENV,
    args: process.argv,
  });

  await resetMarketData(prisma);
  await seed(prisma);

  console.log('시드값 생성');
}

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

main(prisma)
  .catch((error) => {
    console.error('시딩 오류', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
