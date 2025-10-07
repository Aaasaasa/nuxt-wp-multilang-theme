// server/api/posts/[id].get.ts single post by id
import { defineEventHandler } from 'h3'
import { db } from '~/utils/dbClients.ts'

export default defineEventHandler(async event => {
  const id = Number(event.context.params!.id)
  return db.pgCMS.post.findUnique({ where: { id } })
})
