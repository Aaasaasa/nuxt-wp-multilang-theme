import { db } from "~/utils/dbClients";

/**
 * Cache Helper: Holt Daten aus Redis oder führt Fetcher aus und speichert sie.
 * Falls Redis nicht verfügbar ist, wird nur fetcher() ausgeführt.
 */
export async function getOrSet<T>(
  key: string,
  ttlSec: number,
  fetcher: () => Promise<T>
): Promise<T> {
  // Wenn Redis gar nicht aktiv ist → direkt DB/API aufrufen
  if (!db.redis) {
    return fetcher();
  }

  try {
    const hit = await db.redis.get(key);
    if (hit) {
      return JSON.parse(hit) as T;
    }
  } catch (e) {
    console.warn(`[cache] Redis GET failed:`, (e as Error).message);
  }

  const data = await fetcher();

  try {
    await db.redis.set(key, JSON.stringify(data), { EX: ttlSec });
  } catch (e) {
    console.warn(`[cache] Redis SET failed:`, (e as Error).message);
  }

  return data;
}
