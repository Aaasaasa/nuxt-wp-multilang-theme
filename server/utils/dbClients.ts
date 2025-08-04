// server/utils/dbClients.ts
import { PrismaClient as PgPrismaClient } from '@prisma/postgres-client'
import { PrismaClient as MySqlPrismaClient } from '@prisma/mysql-client'
import { PrismaClient as MongoPrismaClient } from '@prisma/mongodb-client'
import { createClient as createRedisClient } from 'redis'
import dotenv from 'dotenv'
dotenv.config()

const redisClient = createRedisClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
})
redisClient.connect().catch(console.error)

export const db = {
  postgres: new PgPrismaClient(),
  mysql: new MySqlPrismaClient(),
  mongo: new MongoPrismaClient(),
  redis: redisClient
}

// Beispiel für Prisma-Generierung:
// prisma generate --schema=prisma/schema-postgres.prisma
// prisma generate --schema=prisma/schema-mysql.prisma
// prisma generate --schema=prisma/schema-mongo.prisma
// Prisma-Client für MongoDB, MySQL und PostgreSQL
// wird automatisch generiert, wenn die entsprechenden Schemas vorhanden sind.
// Die Umgebungsvariablen für die Datenbankverbindungen sollten in der .env-Datei definiert sein.

// Redis usage example
/*
export async function getRedisValue(key: string) {
  try {
    const value = await redisClient.get(key)
    return value
  } catch (error) {
    console.error('Error getting Redis value:', error)
    throw error
  }
}

export async function setRedisValue(key: string, value: string, ttl?: number) {
  try {
    if (ttl) {
      await redisClient.setEx(key, ttl, value)
    } else {
      await redisClient.set(key, value)
    }
  } catch (error) {
    console.error('Error setting Redis value:', error)
    throw error
  }
}

export async function closeDbConnections() {
  await db.postgres.$disconnect()
  await db.mysql.$disconnect()
  await db.mongo.$disconnect()
  await db.redis.quit()
}
*/
// Export Prisma clients for use in other parts of the application
/*
export { PgPrismaClient, MySqlPrismaClient, MongoPrismaClient }
export { redisClient as RedisClient } from 'redis'
export default db
export { db as defaultDb }  // Default export for convenience
export { redisClient as defaultRedisClient }  // Default Redis client export
*/
/*

await db.redis.set('key', 'value')
const result = await db.redis.get('key')
await db.postgres.user.findMany()
await db.mysql.user.findMany()
await db.mongo.user.findMany()

*/
