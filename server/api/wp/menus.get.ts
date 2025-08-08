import { getWpMenu } from '@/server/lib/wp'
import { getOrSet } from '@/server/lib/cache'

export default defineEventHandler(async (event) => {
  const q = getQuery(event)
  const slug = (q.slug as string) || 'main-menu'
  const key  = `wp:menu:${slug}`
  return getOrSet(key, 300, () => getWpMenu(slug))
})
