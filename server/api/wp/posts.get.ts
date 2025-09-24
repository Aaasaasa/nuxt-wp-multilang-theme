import { getWpPosts } from '~/lib/wp'
import { getOrSet } from '~/lib/cache'

export default defineEventHandler(async event => {
  const q = getQuery(event)
  const limit = Number(q.limit || 10)
  const lang = (q.lang as string) || 'all'
  const key = `wp:posts:${limit}:${lang}`
  return getOrSet(key, 60, () => getWpPosts(limit, lang))
})
