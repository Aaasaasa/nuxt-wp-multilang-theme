// lib/prismaCms.ts
import { PrismaClient as PrismaCmsClient } from '@pgClient'
// import { PrismaClient as PrismaCmsClient } from '../../../prisma/generated/postgres-cms/index.js'

const prismaCmsSingleton = () => new PrismaCmsClient()
type PrismaCmsSingleton = ReturnType<typeof prismaCmsSingleton>

declare global {
  var prismaCmsGlobal: PrismaCmsSingleton | undefined
}

const prismaCms = globalThis.prismaCmsGlobal ?? prismaCmsSingleton()
if (process.env.NODE_ENV !== 'production') globalThis.prismaCmsGlobal = prismaCms

export default prismaCms
