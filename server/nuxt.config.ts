// server/nuxt.config.ts

import { defineNuxtConfig } from 'nuxt/config'
import tsconfigPaths from 'vite-tsconfig-paths'
import path from 'path'

export default defineNuxtConfig({
  devtools: { enabled: false },

  // Direktorijum struktura
  srcDir: '.',
  serverDir: '.',

  // ❌ Isključi sve što ima veze sa frontendom
  ssr: false,
  pages: false,
  app: { head: false },

  // ✅ Samo server build
  builder: 'nitro',

  alias: {
    '@@': path.resolve(__dirname, '../'),
    '@@shared': path.resolve(__dirname, '../shared'),
    '@@prisma': path.resolve(__dirname, '../prisma'),
    '@@server': path.resolve(__dirname, './'),
    '#prisma': path.resolve(__dirname, '../prisma')
  },

  // ⚙️ Nitro (server engine) konfiguracija
  nitro: {
    preset: 'node-server',
    serveStatic: false,
    compressPublicAssets: true,
    runtimeConfig: {
      redisUrl: process.env.REDIS_URL
    },
    storage: {
      redis: {
        driver: 'redis',
        url: process.env.REDIS_URL || 'redis://localhost:6379/0'
      }
    },
    externals: {
      inline: [
        '@prisma/client',
        'swagger-jsdoc',
        'swagger-ui-express'
      ]
    }
  },

  // ⚙️ TypeScript setup
  typescript: {
    strict: true,
    tsConfig: {
      compilerOptions: {
        target: 'ES2022',
        moduleResolution: 'Bundler',
        allowImportingTsExtensions: true,
        resolveJsonModule: true,
        esModuleInterop: true,
        forceConsistentCasingInFileNames: true,
        skipLibCheck: true,
        baseUrl: '.',
        paths: {
          '@@*': ['./*'],
          '@@server/*': ['./*'],
          '@@shared/*': ['../shared/*'],
          '@@prisma/*': ['../prisma/*'],
          "#prisma": path.resolve(__dirname, "../prisma")
        }
      }
    }
  },

  // ⚙️ Vite samo kao bundler za backend
  vite: {
    plugins: [tsconfigPaths() as any],
    define: {
      'import.meta.require': undefined,
      'process.server': true,
      'process.client': false
    },
    optimizeDeps: {
      exclude: [
        '@prisma/client',
        'swagger-jsdoc',
        'swagger-ui-express'
      ]
    },
    ssr: {
      noExternal: ['@prisma/client']
    }
},

  compatibilityDate: '2025-09-13'
})
