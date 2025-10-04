// server/api/posts/[id].get.ts single post by id
import { defineEventHandler } from 'h3'
import { pgCMS } from '../../utils/dbClients.ts'

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params!.id)
  return pgCMS.post.findUnique({ where: { id } })
})
