import { defineNuxtConfig } from 'nuxt/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineNuxtConfig({
  // Basic Nuxt config for admin app
  vite: {
    plugins: [tsconfigPaths()]
  },
  nitro: {
    storage: {
      redis: {
        driver: 'redis',
        url: process.env.REDIS_URL || 'redis://localhost:6379/0'
      }
    },

    runtimeConfig: {
      redisUrl: process.env.REDIS_URL
    }
  },
  compatibilityDate: '2025-09-13'
  // Add auth, Prisma, etc., integrations as needed
})
