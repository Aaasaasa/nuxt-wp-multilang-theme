// server/src/index.ts

import Fastify from 'fastify'
import { randomBytes } from 'node:crypto'

async function createServer() {
  const app = Fastify({ logger: true })

  try {
    const cookie = await import('@fastify/cookie')
    await app.register(cookie.default ?? cookie)
    app.log.info('@fastify/cookie registered')
  } catch {
    app.log.info('@fastify/cookie not installed — skipping')
  }

  try {
    const secureSession = await import('@fastify/secure-session')
    const key = Buffer.from(process.env.SECURE_SESSION_KEY ?? randomBytes(32).toString('hex'), 'hex')
    await app.register((secureSession.default ?? secureSession), {
      key,
      cookie: { path: '/', httpOnly: true, secure: process.env.NODE_ENV === 'production' }
    })
    app.log.info('@fastify/secure-session registered')
  } catch {
    app.log.info('@fastify/secure-session not installed — skipping')
  }

  app.get('/health', async () => ({ ok: true, ts: Date.now() }))
  app.get('/api/hello', async () => ({ hello: 'world' }))

  const port = Number(process.env.PORT || 3001)
  const host = process.env.HOST || '0.0.0.0'
  await app.listen({ port, host })
  app.log.info(`Server listening at http://${host}:${port}`)
}

createServer().catch((e) => { console.error(e); process.exit(1) })
