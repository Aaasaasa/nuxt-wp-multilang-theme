import { defineEventHandler } from 'h3'
import { getPrisma } from '~/utils/dbClients'

export default defineEventHandler(async () => {
  const prisma = getPrisma()
  return prisma.page.findMany()
})
