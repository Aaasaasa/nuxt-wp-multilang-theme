// server/api/pages.get.ts
import { defineEventHandler, getQuery } from 'h3'
import { pgCMS } from '../utils/dbClients.ts'

export default defineEventHandler(async (event) => {
  const { lang } = getQuery(event)

  return pgCMS.page.findMany({
    where: { lang: lang ?? 'en' },
    orderBy: { createdAt: 'desc' }
  })
})
