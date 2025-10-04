// server/utils/dbClients.ts
import dotenv from 'dotenv'
dotenv.config()
// Prisma klijenti (koristiš generisane iz prisma/generated/*)
// server/utils/dbClients.ts
import { PrismaClient as PrismaClientCMS } from '@@prisma/postgres-cms/index.js'
import { PrismaClient as PrismaClientMySQL } from '@@prisma/mysql/index.js'
import { PrismaClient as PrismaClientMongo } from '@@prisma/mongo/index.js'

import Redis from 'ioredis'
import mysql from 'mysql2/promise'

// --- Prisma Clients ---

// PostgreSQL CMS база (prisma/adapters/schema-postgres.prisma)
export const pgCMS = new PrismaClientCMS()

// MySQL (prisma/adapters/schema-mysql.prisma)
export const mysqlPrisma = new PrismaClientMySQL()

// MongoDB (prisma/adapters/schema-mongo.prisma)
export const mongoPrisma = new PrismaClientMongo()

// --- Raw MySQL pool (нпр. за WordPress import) ---
export const wp = mysql.createPool({
  uri: process.env.MYSQL_URL || '',
  connectionLimit: 10,
  timezone: 'Z',
  dateStrings: true
} as any)

// --- Redis ---
export const redis = new Redis(process.env.REDIS_URL || 'redis://127.0.0.1:6379')
redis.on('error', err => {
  console.error('[redis] connection error:', err)
})

// --- Unified export object ---
export const db = {
  pgExisting,
  pgCMS,
  mysqlPrisma,
  mongoPrisma,
  wp,
  redis
}

