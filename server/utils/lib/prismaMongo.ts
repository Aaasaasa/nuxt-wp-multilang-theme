//lib/prismaMongo.ts
import { PrismaClient as PrismaMongoClient } from '@mongoClient'

const prismaMongoSingleton = () => new PrismaMongoClient()

type PrismaMongoSingleton = ReturnType<typeof prismaMongoSingleton>

declare global {
  var prismaMongoGlobal: PrismaMongoSingleton | undefined
}

const prismaMongo = globalThis.prismaMongoGlobal ?? prismaMongoSingleton()

if (process.env.NODE_ENV !== 'production') globalThis.prismaMongoGlobal = prismaMongo

export default prismaMongo
