import { getWpPosts } from '../../lib/wp.ts'
import { getOrSet } from '../../lib/cache.ts'
// API route за refresh (server/api/wp/etl/menu.post.ts)
import { defineEventHandler, getQuery } from 'h3'


export default defineEventHandler(async event => {
  const q = getQuery(event)
  const limit = Number(q.limit || 10)
  const lang = (q.lang as string) || 'all'
  const key = `wp:posts:${limit}:${lang}`
  return getOrSet(key, 60, () => getWpPosts(limit, lang))
  // return getOrSet(key, 60, () => getWpPosts(limit, lang))
})
