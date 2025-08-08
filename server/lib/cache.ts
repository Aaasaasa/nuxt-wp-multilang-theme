import { redis } from '@/server/utils/dbClients'

export async function getOrSet<T>(key: string, ttlSec: number, fetcher: () => Promise<T>): Promise<T> {
  try {
    const hit = await redis.get(key)
    if (hit) return JSON.parse(hit) as T
  } catch (_) {}

  const data = await fetcher()
  try {
    await redis.set(key, JSON.stringify(data), { EX: ttlSec })
  } catch (_) {}
  return data
}
