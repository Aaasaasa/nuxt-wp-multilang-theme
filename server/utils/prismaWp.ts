import { PrismaClient as PrismaWpClient } from '../../prisma/mysql'

const prismaWpSingleton = () => new PrismaWpClient()

type PrismaWpSingleton = ReturnType<typeof prismaWpSingleton>

declare global {
  var prismaWpGlobal: PrismaWpSingleton | undefined
}

const prismaWp = globalThis.prismaWpGlobal ?? prismaWpSingleton()

if (process.env.NODE_ENV !== 'production') globalThis.prismaWpGlobal = prismaWp

export default prismaWp
