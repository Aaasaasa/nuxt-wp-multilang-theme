// server/api/pages.get.ts
import { defineEventHandler, getQuery } from 'h3'
import { db } from '../utils/dbClients.ts'

export default defineEventHandler(async event => {
  const { lang } = getQuery(event)

  return db.pgCMS.page.findMany({
    where: { lang: lang ?? 'en' },
    orderBy: { createdAt: 'desc' }
  })
})
