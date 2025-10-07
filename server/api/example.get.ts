// server/api/example.get.ts
import { db } from '../utils/dbClients'
import { defineEventHandler } from 'h3'

export default defineEventHandler(async () => {
  return await db.pgCMS.article.findMany() // Sicher und typsicher
})
