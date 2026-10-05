import { PrismaClient } from '#generated/prisma/client.ts';
import { fakerKO as faker } from '@faker-js/faker';
import { PrismaPg } from '@prisma/adapter-pg';
import { assertSafeSeedTarget, resetProductsData } from './seed-safety.js';

const NUM_PRODUCTS_TO_CREATE = 10;

const makeProductInput = () => ({
  name: faker.commerce.productName(),
  description: faker.commerce.productDescription(),
  price: faker.number.int({ min: 0, max: 100000 }),
  tags: faker.helpers.arrayElements(
    [faker.commerce.department(), faker.commerce.productAdjective()],
    { min: 1, max: 2},
  ),
});

async function seed(prisma) {
  const productData = Array.from(
    {
      length: NUM_PRODUCTS_TO_CREATE,
    },
    makeProductInput,
  );

  await prisma.product.createMany({ data: productData });

  return { productCount: productData.length };
}

async function main(prisma) {
  assertSafeSeedTarget({
    databaseUrl: process.env.DATABASE_URL,
    nodeEnv: process.env.NODE_ENV,
    args: process.argv,
  });

  await resetProductsData(prisma);

  const result = await seed(prisma);

  console.log(
    `${result.productCount}개의 상품 데이터가 성공적으로 생성되었습니다.`,
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
