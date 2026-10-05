const DATABASE_NAME = 'sprint_mission';
const RESET_CONFIRMATION = `--allow-reset=${DATABASE_NAME}`;
const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '[::1]']);

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
    !LOCAL_HOSTS.has(target.hostname) ||
    databaseName !== DATABASE_NAME ||
    !isConfirmed
  ) {
    throw new Error('Refusing to reset a database outside the local target');
  }

  return true;
}

export function resetAllData(prisma) {
  return prisma.$transaction([
    prisma.productComment.deleteMany(),
    prisma.articleComment.deleteMany(),
    prisma.product.deleteMany(),
    prisma.article.deleteMany(),
  ]);
}
