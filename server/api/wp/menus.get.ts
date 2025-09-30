import { getWpMenu } from '~/lib/wp'
import { getOrSet } from '~/lib/cache'
import { defineEventHandler, getQuery } from 'h3'


export default defineEventHandler(async (event) => {
  const q = getQuery(event)
  const slug = (q.slug as string) || 'main-menu'
  const key = `wp:menu:${slug}`

  const menu = await getOrSet(key, 300, () => getWpMenu(slug))
  return menu || { slug, items: [] }
})
