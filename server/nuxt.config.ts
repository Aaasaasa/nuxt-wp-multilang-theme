import { defineNuxtConfig } from 'nuxt/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineNuxtConfig({
  srcDir: '.',
  serverDir: '.',
  vite: {
    plugins: [tsconfigPaths()]
  },
  alias: {
  },
  nitro: {
    preset: 'node-server',  // pravi čisti node server
    serveStatic: false,
    storage: {
      redis: {
        driver: 'redis',
        url: process.env.REDIS_URL || 'redis://localhost:6379/0'
      }
    }
  },
  runtimeConfig: {
    redisUrl: process.env.REDIS_URL
  },
  compatibilityDate: '2025-09-13'
})
