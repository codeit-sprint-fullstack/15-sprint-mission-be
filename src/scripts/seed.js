// 파일: scripts/seed.js
import { faker } from '@faker-js/faker';
import { PrismaClient } from '#generated/prisma/client.ts';
import { PrismaPg } from '@prisma/adapter-pg';
import { assertSafeSeedTarget, resetBlogData } from './seed-safety.js';

const NUM_USERS_TO_CREATE = 10;

const makeUserInput = (index) => ({
  email: `user${index}@example.com`,
  name: faker.person.fullName(),
});

const makeItemInput = () => ({
  name: faker.commerce.productName(),
  description: faker.commerce.productDescription(),
  price: faker.number.int({ min: 1000, max: 500000 }),
  tags: faker.helpers.arrayElements(
    ['전자기기', '의류', '도서', '생활용품', '스포츠', '가구', '뷰티', '식품'],
    { min: 1, max: 3 },
  ),
});

const makeArticleInput = (writerId) => ({
  title: faker.lorem.sentence({ min: 3, max: 8 }),
  content: faker.lorem.paragraphs({ min: 2, max: 5 }, '\n\n'),
  writerId,
});

const makeArticleCommentInput = (articleId, writerId) => ({
  content: faker.lorem.paragraphs({ min: 2, max: 5 }, '\n\n'),
  articleId,
  writerId,
});
const makeProductCommentInput = (itemId, writerId) => ({
  content: faker.lorem.sentence(),
  itemId,
  writerId,
});

async function seed(prisma) {
  //1 userData 생성 시 조건
  const userData = Array.from({ length: NUM_USERS_TO_CREATE }, (_, index) =>
    makeUserInput(index + 1),
  );

  // 1-1. 부모 User 생성
  const users = await prisma.user.createManyAndReturn({ data: userData });

  // 2. 부모 ID를 가진 자식 articelData 입력 생성
  const articleData = [];
  for (const user of users) {
    const count = faker.number.int({ min: 1, max: 5 });
    for (let index = 0; index < count; index += 1) {
      articleData.push(makeArticleInput(user.id));
    }
  }

  // 2-1. 자식 articles 생성
  const articles = await prisma.article.createManyAndReturn({
    data: articleData,
  });

  //3. commentData 생성시 조건
  const articleCommentData = [];
  for (const article of articles) {
    const count = faker.number.int({ min: 1, max: 3 });
    for (let index = 0; index < count; index += 1) {
      const randomWriter = faker.helpers.arrayElement(users); // 랜덤한 댓글 작성자로 설정
      articleCommentData.push(
        makeArticleCommentInput(article.id, randomWriter.id),
      );
    }
  }

  //3-1. comment 데이터 생성
  await prisma.articleComment.createMany({ data: articleCommentData });

  // Item 생성
  const NUM_ITEMS_TO_CREATE = 20; // 원하는 개수로 조절
  const itemData = Array.from({ length: NUM_ITEMS_TO_CREATE }, () =>
    makeItemInput(),
  );
  const items = await prisma.item.createManyAndReturn({ data: itemData });

  // ProductComment 생성
  const productCommentData = [];
  for (const item of items) {
    const count = faker.number.int({ min: 0, max: 3 });
    for (let index = 0; index < count; index += 1) {
      const randomWriter = faker.helpers.arrayElement(users);
      productCommentData.push(
        makeProductCommentInput(item.id, randomWriter.id),
      );
    }
  }
  await prisma.productComment.createMany({ data: productCommentData });

  return {
    userCount: users.length,
    articleCount: articles.length,
    articleCommentCount: articleCommentData.length,
    itemCount: items.length,
    productCommentCount: productCommentData.length,
  };
}

async function main(prisma) {
  assertSafeSeedTarget({
    databaseUrl: process.env.DATABASE_URL,
    nodeEnv: process.env.NODE_ENV,
    args: process.argv,
  });

  await resetBlogData(prisma);
  const result = await seed(prisma);

  console.log(`${result.userCount}명의 사용자가 생성되었습니다.`);
  console.log(`${result.articleCount}개의 게시글이 생성되었습니다.`);
  console.log(`${result.articleCommentCount}개의 자유게시판 댓글이 생성되었습니다.`);
  console.log(`${result.itemCount}개의 상품이 생성되었습니다.`);
  console.log(
    `${result.productCommentCount}개의 중고마켓 댓글이 생성되었습니다.`,
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
