// filepath: /srv/stranice/nuxt-multilang-theme-develop/server/api/admin/pages/[id].put.ts
import { defineEventHandler, readBody } from 'h3'
import { db } from '~/utils/dbClients.ts'

export default defineEventHandler(async event => {
  const id = Number(event.context.params!.id)
  const body = await readBody(event)

  // Raw SQL za update as_posts
  await db.mysql.execute(
    'UPDATE as_posts SET post_name = ?, post_title = ?, post_content = ? WHERE ID = ?',
    [body.slug, body.title, body.content, id]
  ) as [import('mysql2').ResultSetHeader, any]  // Cast ako treba

  return { success: true }
})
