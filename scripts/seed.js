import { faker } from '@faker-js/faker';
import { PrismaClient } from '#generated/prisma/client.ts';
import { PrismaPg } from '@prisma/adapter-pg';
import { assertSafeSeedTarget, resetPandaMarketDB } from './seed-safety.js';

const NUM_PRODUCTS_TO_CREATE = 100;
const NUM_ARTICLES_TO_CREATE = 30;
const NUM_COMMENTS_PER_PARENT = 5;
const TAG_POOL = [
  '미개봉 새상품',
  '반값택배 가능',
  '정품 인증 가능',
  '구매후 반품 불가',
];
const RANDOM_IMAGE_URL = `https://loremflickr.com/320/240/product`;
const NUM_IMAGES_PER_PRODUCT = 3;

const makeProductInput = (index) => ({
  name: `상품${index}`,
  description: `${index}번째 상품입니다.`,
  price: faker.number.int({ min: 100, max: 1000 }) * 100,
  tags: faker.helpers.arrayElements(TAG_POOL, { min: 0, max: TAG_POOL.length }),
  images: Array.from(
    { length: NUM_IMAGES_PER_PRODUCT },
    () => RANDOM_IMAGE_URL,
  ),
});

const makeArticleInput = () => ({
  title: faker.lorem.sentence({ min: 3, max: 5 }),
  content: faker.lorem.paragraphs({ min: 3, max: 5 }, '\n\n'),
});

const makeProductCommentInput = (productId) => ({
  content: faker.lorem.sentences({ min: 1, max: 3 }),
  productId,
});

const makeArticleCommentInput = (articleId) => ({
  content: faker.lorem.sentences({ min: 1, max: 3 }),
  articleId,
});

async function seed(prisma) {
  const productData = Array.from(
    { length: NUM_PRODUCTS_TO_CREATE },
    (_, index) => makeProductInput(index + 1),
  );
  const products = await prisma.product.createManyAndReturn({
    data: productData,
  });

  const articleData = Array.from({ length: NUM_ARTICLES_TO_CREATE }, () =>
    makeArticleInput(),
  );

  const articles = await prisma.article.createManyAndReturn({
    data: articleData,
  });

  const commentData = [];
  for (const product of products) {
    for (let i = 0; i < NUM_COMMENTS_PER_PARENT; i++) {
      commentData.push(makeProductCommentInput(product.id));
    }
  }
  for (const article of articles) {
    for (let i = 0; i < NUM_COMMENTS_PER_PARENT; i++) {
      commentData.push(makeArticleCommentInput(article.id));
    }
  }

  const comments = await prisma.comment.createManyAndReturn({
    data: commentData,
  });

  return {
    productCount: products.length,
    articleCount: articles.length,
    commentCount: comments.length,
  };
}

async function main(prisma) {
  assertSafeSeedTarget({
    databaseUrl: process.env.DATABASE_URL,
    nodeEnv: process.env.NODE_ENV,
    args: process.argv,
  });

  await resetPandaMarketDB(prisma);
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
    console.error('시딩 오류', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
