import { PrismaClient as PrismaWpClient } from '@wpClient'

const prismaWpSingleton = () => new PrismaWpClient()

type PrismaWpSingleton = ReturnType<typeof prismaWpSingleton>

declare global {
  // eslint-disable-next-line no-var
  var prismaWpGlobal: PrismaWpSingleton | undefined
}

const prismaWp = globalThis.prismaWpGlobal ?? prismaWpSingleton()

if (process.env.NODE_ENV !== 'production') globalThis.prismaWpGlobal = prismaWp

export default prismaWp
