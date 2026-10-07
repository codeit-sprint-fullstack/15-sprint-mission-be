const DATABASE_NAME = 'prisma_market';
const RESET_CONFIRMATION = `--allow-reset=${DATABASE_NAME}`;

export function assertSafeSeedTarget({ databaseUrl, nodeEnv, args }) {
  let target;
  try {
    target = new URL(databaseUrl);
  } catch {
    throw new Error('DATABASE_URL must be a valid URL');
  }

  const databaseName = decodeURIComponent(target.pathname.slice(1));
  const isPostgres = ['postgresql:', 'postgres:'].includes(target.protocol);
  const isConfirmed = args.includes(RESET_CONFIRMATION);

  if (
    nodeEnv !== 'development' ||
    !isPostgres ||
    databaseName !== DATABASE_NAME ||
    !isConfirmed
  ) {
    console.log(nodeEnv);
    console.log('!', !isPostgres);
    console.log(
      'databaseName !== DATABASE_NAME',
      databaseName !== DATABASE_NAME,
    );
    console.log('!isConfirmed', !isConfirmed);
    throw new Error('Refusing to reset a database outside the local target');
  }

  return true;
}

export function resetMarketData(prisma) {
  return prisma.$transaction([
    prisma.product.deleteMany(),
    prisma.article.deleteMany(),
    prisma.comment.deleteMany(),
  ]);
}
