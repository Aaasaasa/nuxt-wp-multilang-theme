import { PrismaClient as MySQLClient } from '../../../prisma/generated/mysql'
import { defineEventHandler } from 'h3'

const prisma = new MySQLClient()

export default defineEventHandler(async () => {
  try {
    const pages = await prisma.as_posts.findMany({
      where: { post_type: 'page', post_status: 'publish' },
      select: {
        ID: true,
        post_title: true,
        post_name: true,
        post_date: true
      },
      orderBy: { post_date: 'desc' }
    })

    return pages
  } catch (err) {
    console.error('[pages.get] error:', (err as Error).message)
    return []
  } finally {
    await prisma.$disconnect()
  }
})
