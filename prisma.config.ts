// prisma.config.ts
import { defineConfig } from '@prisma/config'

export default defineConfig({
  schema: './prisma/adapters',
  // schemaDir: './prisma/adapters',
  // schemaBaseName: 'schema-postgres.prisma',
  // generators: [], // пусто, нема default генератора
  /*
  schemas: [
    './prisma/adapters/schema-postgres.prisma',
    './prisma/adapters/schema-mysql.prisma',
    './prisma/adapters/schema-mongo.prisma'
  ]
  */
})
