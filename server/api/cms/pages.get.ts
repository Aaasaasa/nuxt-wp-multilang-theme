// server/api/posts.get.ts list of posts
import { defineEventHandler } from 'h3'
import { pgCMS } from '../../utils/dbClients.ts'

export default defineEventHandler(async () => {
  return pgCMS.post.findMany({
    take: 20,
    orderBy: { createdAt: 'desc' }
  })
})
