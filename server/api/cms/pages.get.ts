// server/api/posts.get.ts list of posts
import { defineEventHandler } from 'h3'
import { db } from '../../utils/dbClients.ts'

export default defineEventHandler(async () => {
  return db.pgCMS.post.findMany({
    take: 20,
    orderBy: { createdAt: 'desc' }
  })
})
