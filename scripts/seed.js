import { prisma } from '../src/db/prisma.js';

// 다양한 샘플 텍스트 모음
const sampleTitles = [
  'Express v5와 Prisma v7 도입 후기',
  'Cursor 기반 페이지네이션 구축 가이드',
  '계층형 아키텍처(Layered Architecture)의 장점',
  'Zod를 통한 백엔드 요청 데이터 검증',
  'PostgreSQL Soft Delete 패턴 구현하기',
];

const sampleContents = [
  'Node.js v24 환경에서 최신 백엔드 기술 스택을 활용하면 우수한 개발 경험과 생산성을 가져다줍니다.',
  'Offset 방식과 달리 Cursor 방식은 대용량 데이터베이스에서도 항상 빠른 조회를 보장합니다.',
  'Route-Controller-Service-Repository 레이어 분리를 통해 비즈니스 로직을 명확히 격리했습니다.',
  'DTO 레벨에서 Zod 스키마를 검증하면 데이터 안전성이 획기적으로 증가합니다.',
];

const sampleReplies = [
  '정말 유익하고 깔끔하게 잘 정리된 글이네요!',
  '실무에 바로 적용해 보려고 합니다. 감사합니다.',
  '추가적인 포스팅 계획이 있으신지 궁금합니다.',
  '이 부분에 대해서 깊이 있게 이해할 수 있었습니다. 추천합니다!',
];

async function runSeed() {
  console.log('🌱 30개 대량 데이터 독립 시딩 스크립트 시작...');

  // 1. 기존 데이터 초기화 (외래 키 참조 관계에 따라 자식인 ArticleReply부터 삭제)
  console.log('🧹 기존 댓글 및 게시글 데이터 삭제 중...');
  await prisma.articleReply.deleteMany({});
  await prisma.article.deleteMany({});

  console.log('📝 30개의 게시글과 각 게시글당 30개의 댓글 생성 시작...');

  // 2. 30개의 게시글 생성
  for (let i = 1; i <= 30; i++) {
    const titleCategory = sampleTitles[(i - 1) % sampleTitles.length];
    const contentCategory = sampleContents[(i - 1) % sampleContents.length];

    const article = await prisma.article.create({
      data: {
        title: `[${i}번째 게시글] ${titleCategory}`,
        content: `${contentCategory} (생성 순번: ${i})`,
      },
    });

    // 3. 방금 생성된 article.id를 외래 키로 가지는 댓글 30개 데이터 준비
    const repliesData = Array.from({ length: 30 }, (_, replyIndex) => {
      const replyNum = replyIndex + 1;
      const replyTemplate =
        sampleReplies[(replyNum - 1) % sampleReplies.length];
      return {
        articleId: article.id,
        content: `${i}번 게시글의 ${replyNum}번째 댓글: ${replyTemplate}`,
      };
    });

    // 💡 createMany를 활용하여 한 번의 쿼리로 해당 게시글의 댓글 30개를 일괄 생성
    await prisma.articleReply.createMany({
      data: repliesData,
    });
  }

  console.log(
    '✅ 총 30개의 게시글과 900개의 댓글이 성공적으로 생성되었습니다!',
  );
}

runSeed()
  .catch((error) => {
    console.error('❌ 시딩 중 에러 발생:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
