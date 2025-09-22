// app/admin/nuxt.config.ts
/*
import tailwindcss from '@tailwindcss/postcss'
import tsconfigPaths from 'vite-tsconfig-paths'
import typography from '@tailwindcss/typography'
import { defineNuxtConfig } from 'nuxt/config'
import { fileURLToPath } from 'node:url'
*/
//<import tsconfigPaths from 'vite-tsconfig-paths'

// app/admin/nuxt.config.ts

import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  typescript: {
    shim: false
  },
  modules: [
    '@nuxt/ui',
    '@nuxt/image',
    '@nuxtjs/i18n',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    'nuxt-security' // ➝ security moduli za prod
  ],
  css: ['~/assets/css/tailwind.css'],
  components: [{ path: '~/components', extensions: ['vue'], pathPrefix: false }],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {}
    }
  },
  ui: {
    icons: ['lucide', 'openmoji']
  },
  i18n: {
    locales: [
      { code: 'en', name: 'English', files: ['en/common.json', 'en/seo.json'] },
      { code: 'de', name: 'Deutsch', files: ['de/common.json', 'de/seo.json'] },
      { code: 'sr', name: 'Србски', files: ['sr/common.json', 'sr/seo.json'] }
    ],
    defaultLocale: 'de',
    strategy: 'prefix_except_default'
  },
  security: {
    headers: {
      contentSecurityPolicy: {
        'default-src': ["'self'"],
        'img-src': ["'self'", 'data:', 'https:'],
        'style-src': ["'self'", "'unsafe-inline'"],
        'script-src': ["'self'"],
        'font-src': ["'self'", 'data:'],
        'object-src': ["'none'"],
        'frame-ancestors': ["'none'"],
        'base-uri': ["'self'"],
        'form-action': ["'self'"]
      },
      xFrameOptions: 'DENY',
      xContentTypeOptions: 'nosniff',
      referrerPolicy: 'no-referrer',
      strictTransportSecurity: { maxAge: 31536000, includeSubdomains: true, preload: true }
    },
    corsHandler: {
      origin: process.env.NODE_ENV === 'development'
        ? ['http://localhost:3300']
        : [process.env.ADMIN_URL].filter(Boolean),
      credentials: true
    },
    rateLimiter: {
      tokensPerInterval: 100,
      interval: 300000, // 5 min
      throwError: true
    },
    requestSizeLimiter: { maxRequestSizeInBytes: 2_000_000, maxUploadFileRequestInBytes: 8_000_000 },
    hidePoweredBy: true
  },
  routeRules: {
    '/api/**': { cors: true, headers: { 'Access-Control-Max-Age': '86400' } },
    '/admin/**': { middleware: ['auth'] }
  },
  compatibilityDate: '2025-09-13'
})
