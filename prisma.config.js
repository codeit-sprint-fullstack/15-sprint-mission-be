import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migration: {
    path: 'prisma/migration',
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
});
