import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import mysql from "mysql2/promise";
import { createClient } from "redis";
import type { RedisClientType } from "redis";

dotenv.config();

// --- PostgreSQL via Prisma (nutzt POSTGRES_URL aus .env) ---
export const pg = new PrismaClient({
  datasourceUrl: process.env.POSTGRES_URL,
});

// --- WordPress MySQL via mysql2 ---
function buildMySqlPool() {
  const url = process.env.MYSQL_URL;

  if (url) {
    return mysql.createPool(url + "?timezone=Z&dateStrings=true");
  }

  return mysql.createPool({
    host: process.env.MYSQL_HOST,
    port: Number(process.env.MYSQL_PORT || 3306),
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_NAME,
    timezone: "Z",
    dateStrings: true,
    connectionLimit: 10,
  });
}

export const wp = buildMySqlPool();

// --- Redis (cache) ---
let redis: RedisClientType | null = null;

try {
  redis = createClient({
    url: process.env.REDIS_URL || "redis://127.0.0.1:6379",
    password: process.env.REDIS_PASSWORD || undefined,
  });

  redis.on("error", (err) => {
    console.error("[redis] connection error:", err);
  });

  // Async Connect
  redis
    .connect()
    .catch((e) => console.error("[redis] connect error:", e.message));
} catch (e) {
  console.error("[redis] init failed:", (e as Error).message);
}

export const getPrisma = () => pg;
// Unified export
export const db = { postgres: pg, mysql: wp, redis };
