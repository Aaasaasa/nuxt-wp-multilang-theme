// filepath: /srv/stranice/nuxt-multilang-theme-develop/server/api/admin/pages/index.get.ts
import { defineEventHandler } from 'h3'
import { db } from '../../../utils/dbClients.ts'

export default defineEventHandler(async () => {
  // Raw SQL za select iz as_posts
  const [rows] = await db.mysql.execute(
    'SELECT ID, post_name, post_title, post_content FROM as_posts WHERE post_type = ? ORDER BY post_date DESC',
    ['page']
  ) as [any[], any]  // Cast za SELECT (array objekata)

  // Mapiraj na frontend format
  return rows.map(row => ({
    id: row.ID,
    slug: row.post_name,
    title: row.post_title,
    content: row.post_content
  }))
})
