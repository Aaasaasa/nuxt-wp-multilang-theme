import dotenv from 'dotenv'
dotenv.config()

import { PrismaClient } from '@prisma/client'
import mysql from 'mysql2/promise'
import { createClient as createRedisClient } from 'redis'

// --- PostgreSQL via Prisma (stable) ---
export const pg = new PrismaClient()

// --- WordPress MySQL via mysql2 (robust even if Prisma gen fails) ---
function buildMySqlPool() {
  const url = process.env.MYSQL_URL
  if (url) return mysql.createPool(url + '?timezone=Z&dateStrings=true')

  return mysql.createPool({
    host: process.env.MYSQL_HOST || '127.0.0.1',
    port: Number(process.env.MYSQL_PORT || 3306),
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_NAME || 'wordpress',
    timezone: 'Z',
    dateStrings: true,
    connectionLimit: 10
  })
}

export const wp = buildMySqlPool()

// --- Redis (cache) ---
export const redis = createRedisClient({
  url: process.env.REDIS_URL || 'redis://127.0.0.1:6379'
})
redis.connect().catch((e) => console.error('[redis] connect error', e))

// unified export (optional)
export const db = { postgres: pg, mysql: wp, redis }
