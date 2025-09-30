// filepath: /srv/stranice/nuxt-multilang-theme-develop/server/api/admin/pages/index.post.ts
import { defineEventHandler, readBody } from 'h3'
import { db } from '~/utils/dbClients.ts'

export default defineEventHandler(async event => {
  const body = await readBody(event)

  // Raw SQL za insert u as_posts
  const [result] = await db.mysql.execute(
    'INSERT INTO as_posts (post_name, post_title, post_content, post_type, post_status) VALUES (?, ?, ?, ?, ?)',
    [body.slug, body.title, body.content, 'page', 'publish']
  ) as [import('mysql2').ResultSetHeader, any]  // Cast za INSERT

  return { id: result.insertId, slug: body.slug, title: body.title, content: body.content }
})
