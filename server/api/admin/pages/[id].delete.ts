// filepath: /srv/stranice/nuxt-multilang-theme-develop/server/api/admin/pages/[id].delete.ts
import { defineEventHandler } from 'h3'
import { db } from '../../../utils/dbClients.ts'

export default defineEventHandler(async event => {
  const id = Number(event.context.params!.id)

  // Raw SQL za delete iz as_posts
  await db.mysql.execute('DELETE FROM as_posts WHERE ID = ?', [id]) as [import('mysql2').ResultSetHeader, any]  // Cast ako treba

  return { success: true }
})
