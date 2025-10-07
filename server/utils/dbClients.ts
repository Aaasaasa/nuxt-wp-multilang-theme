import { createPool, Pool } from 'mysql2/promise'
import Redis from 'ioredis'
import dotenv from 'dotenv'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

dotenv.config()

const __dirname = dirname(fileURLToPath(import.meta.url))

/**
 * Safely import a generated Prisma client if it exists.
 */
async function safeImportPrisma(relativePath: string) {
  const fullPath = join(__dirname, relativePath)
  try {
    const mod = await import(fullPath)
    if (mod?.PrismaClient) {
      const client = new mod.PrismaClient()
      await client.$connect()
      console.log(`[dbClients] Connected: ${relativePath}`)
      return client
    }
  } catch (err) {
    console.warn(`[dbClients] ⚠ Prisma import failed for ${relativePath}:`, (err as Error).message)
  }
  return null
}

/**
 * Initialize all database clients (Postgres, MySQL, Mongo, Redis, WP)
 */
export async function initDb() {
  const [pgCMS, mysqlPrisma, mongoPrisma] = await Promise.all([
    safeImportPrisma('../../prisma/generated/postgres-cms/index.js'),
    safeImportPrisma('../../prisma/generated/mysql/index.js'),
    safeImportPrisma('../../prisma/generated/mongo/index.js')
  ])

  // ✅ MySQL pool (WordPress / legacy)
  const wp: Pool = createPool({
    uri: process.env.MYSQL_URL,
    connectionLimit: 10,
    timezone: 'Z',
    dateStrings: true
  })

  // ✅ Redis client
  const redis = new Redis(process.env.REDIS_URL || 'redis://127.0.0.1:6379', {
    maxRetriesPerRequest: null,
    connectTimeout: 8000
  })

  redis.on('connect', () => console.log('[redis] connected'))
  redis.on('error', err => console.error('[redis] ❌ connection error:', err.message))

  return { pgCMS, mysqlPrisma, mongoPrisma, wp, redis }
}

/**
 * Initialize once and reuse (lazy singleton)
 */
export const db = await initDb()

export type DatabaseClients = Awaited<typeof db>
