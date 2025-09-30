import dotenv from 'dotenv'
import mysql from 'mysql2/promise'
import Redis from 'ioredis'
import type { Redis as RedisType } from 'ioredis'

// Koristi custom generated klijente
import { PrismaClient as PrismaClientExisting } from '../../prisma/generated/postgres-existing'
import { PrismaClient as PrismaClientCMS } from '@@prisma/generated/postgres/cms'  // Dodaj za CMS bazu
import { PrismaClient as PrismaClientMySQL } from '@@/prisma/generated/mysql'
import { PrismaClient as PrismaClientMongo } from '@@/prisma/generated/mongo'

dotenv.config()

// --- PostgreSQL za postojeću bazu ---
export const pg = new PrismaClientExisting({
  datasourceUrl: process.env.POSTGRES_URL
})

// --- PostgreSQL za CMS bazu (novi model) ---
export const pgCMS = new PrismaClientCMS({
  datasourceUrl: process.env.POSTGRES_CMS_URL
})

// --- MySQL via Prisma ---
export const mysqlPrisma = new PrismaClientMySQL({
  datasourceUrl: process.env.MYSQL_URL
})

// --- MongoDB via Prisma ---
export const mongoPrisma = new PrismaClientMongo({
  datasourceUrl: process.env.MONGO_URL
})

// --- Raw MySQL (ako trebaš) ---
function buildMySqlPool() {
  const url = process.env.MYSQL_URL
  if (url) {
    return mysql.createPool(url + '?timezone=Z&dateStrings=true')
  }
  return mysql.createPool({
    host: process.env.MYSQL_HOST,
    port: Number(process.env.MYSQL_PORT || 3306),
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_NAME,
    timezone: 'Z',
    dateStrings: true,
    connectionLimit: 10
  })
}
export const wp = buildMySqlPool()

// --- Redis ---
let redis: RedisType | null = null
try {
  redis = new Redis(process.env.REDIS_URL || 'redis://127.0.0.1:6379')
  redis.on('error', err => {
    console.error('[redis] connection error:', err)
  })
} catch (e) {
  console.error('[redis] init failed:', (e as Error).message)
}

// Unified export
export const db = { postgres: pg, postgresCMS: pgCMS, mysql: wp, mysqlPrisma, mongo: mongoPrisma, redis }
/*
npx prisma generate --schema=prisma/schema.prisma
npx prisma generate --schema=prisma/adapters/schema-postgres-new.prisma
npx prisma generate --schema=prisma/adapters/schema-mysql.prisma
npx prisma generate --schema=prisma/adapters/schema-mongo.prisma

npx prisma migrate dev --schema=prisma/schema.prisma --name existing
npx prisma migrate dev --schema=prisma/adapters/schema-postgres-new.prisma --name new
# Migriraj mysql/mongo ako trebaš
*/
