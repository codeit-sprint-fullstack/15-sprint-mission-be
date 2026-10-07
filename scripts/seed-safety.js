const DATABASE_NAME = 'panda_market_db';
const RESET_CONFIRMATION = `--allow-reset=${DATABASE_NAME}`;
const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '[::1]']);

export function assertSafeSeedTarget({ databaseUrl, nodeEnv, args }) {
  let target;
  try {
    target = new URL(databaseUrl);
  } catch {
    throw new Error('DATABASE_URL이 유효하지 않습니다.');
  }

  const databaseName = decodeURIComponent(target.pathname.slice(1));
  const isPostgres = ['postgresql:', 'postgres:'].includes(target.protocol);
  const isConfirmed = args.includes(RESET_CONFIRMATION);

  if (
    nodeEnv !== 'development' ||
    !isPostgres ||
    !LOCAL_HOSTS.has(target.hostname) ||
    databaseName !== DATABASE_NAME ||
    !isConfirmed
  ) {
    console.log('현재 NODE_ENV:', nodeEnv);
    console.log('PostgreSQL 서버가 아닌가?:', !isPostgres);
    console.log('로컬 호스트가 아닌가?:', !LOCAL_HOSTS.has(target.hostname));
    console.log(
      '삭제해도 되는 데이터베이스가 아닌가?:',
      databaseName !== DATABASE_NAME,
    );
    console.log('리셋을 허용하는 인자가 없는가?:', !isConfirmed);
    throw new Error(
      '시딩 대상이 안전한 로컬 개발 DB가 아닙니다. DB 리셋을 중단합니다.',
    );
  }

  return true;
}

export function resetPandaMarketDB(prisma) {
  return prisma.$transaction([
    prisma.comment.deleteMany(),
    prisma.article.deleteMany(),
    prisma.product.deleteMany(),
  ]);
}
