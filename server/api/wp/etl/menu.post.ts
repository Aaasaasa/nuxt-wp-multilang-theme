// API route за refresh (server/api/wp/etl/menu.post.ts)
// refresh WordPress menu from MySQL to Postgres JSONB
import { defineEventHandler, readBody } from 'h3'
import { etlMenu } from '~/lib/etl'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ slug?: string }>(event)
  const slug = body.slug || 'main-menu'
  return etlMenu(slug)
})
