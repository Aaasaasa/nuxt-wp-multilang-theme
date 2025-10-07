// filepath: /srv/stranice/nuxt-multilang-theme-develop/server/api/admin/pages/[id].get.ts
import { defineEventHandler, createError } from 'h3'
import { db } from '~/utils/dbClients.ts'

export default defineEventHandler(async event => {
  const id = Number(event.context.params!.id)

  // Raw SQL za select jednog iz as_posts
  const [rows] = (await db.mysqlPrisma.execute(
    'SELECT ID, post_name, post_title, post_content FROM as_posts WHERE ID = ?',
    [id]
  )) as [any[], any] // Cast za SELECT

  if (rows.length === 0) {
    throw createError({ statusCode: 404, statusMessage: 'Page not found' })
  }

  const row = rows[0]
  return {
    id: row.ID,
    slug: row.post_name,
    title: row.post_title,
    content: row.post_content
  }
})
