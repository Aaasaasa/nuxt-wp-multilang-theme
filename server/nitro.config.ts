// server/nitro.config.ts
import { defineNitroConfig } from 'nitropack'

export default defineNitroConfig({
  compatibilityDate: '2025-09-26',

  // Redis cache (ako želiš)
  storage: {
    redis: {
      driver: 'redis',
      url: process.env.REDIS_URL || 'redis://localhost:6379/0'
    }
  },

  runtimeConfig: {
    // dbUrl: process.env.DATABASE_URL,
    redisUrl: process.env.REDIS_URL,
    // mongoUrl: process.env.MONGODB_URI
  }
})
