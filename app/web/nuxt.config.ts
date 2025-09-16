// app/web/nuxt.config.ts
import { fileURLToPath } from 'node:url'

export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    '@nuxt/ui',
    '@nuxt/image',
    '@nuxtjs/i18n',
    '@nuxtjs/seo',
    'nuxt-security',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    'nuxt-auth-utils'
  ],

  alias: {
    '@': fileURLToPath(new URL('.', import.meta.url)),
    '~': fileURLToPath(new URL('.', import.meta.url))
  },

  app: {
    head: {
      htmlAttrs: { lang: 'de' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'format-detection', content: 'telephone=no' }
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
    }
  },

  i18n: {
    locales: [
      { code: 'en', name: 'English', files: ['en/common.json', 'en/seo.json'], language: 'en-US', flag: 'i-openmoji:flag-united-states' },
      { code: 'fr', name: 'Français', files: ['fr/common.json', 'fr/seo.json'], language: 'fr-FR', flag: 'i-openmoji:flag-france' },
      { code: 'de', name: 'Deutsch', files: ['de/common.json', 'de/seo.json'], language: 'de-DE', flag: 'i-openmoji:flag-germany' },
      { code: 'sr', name: 'Србски', files: ['sr/common.json', 'sr/seo.json'], language: 'sr-SR', flag: 'i-openmoji:flag-serbia' },
      { code: 'ru', name: 'Russia', files: ['ru/common.json', 'ru/seo.json'], language: 'ru-RU', flag: 'i-openmoji:flag-russia' },
      { code: 'es', name: 'Español', files: ['es/common.json', 'es/seo.json'], language: 'es-ES', flag: 'i-openmoji:flag-spain' },
      { code: 'it', name: 'Italy', files: ['it/common.json', 'it/seo.json'], language: 'it-IT', flag: 'i-openmoji:flag-italy' },
    ],
    defaultLocale: 'de',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root'
    }
  },

  css: ['~/assets/css/tailwind.css'],
  components: [
    {
      path: '~/components',
      extensions: ['vue'],
      pathPrefix: false
    }
  ],

  vite: {
    resolve: {
      alias: {
        '.prisma/client/index-browser': './node_modules/.prisma/client/index-browser.js'
      }
    }
  },

  security: {
    headers: {
      contentSecurityPolicy: {
        'base-uri': ["'self'"],
        'font-src': ["'self'", 'https:', 'data:'],
        'form-action': ["'self'"],
        'frame-ancestors': ["'none'"],
        'img-src': ["'self'", 'data:', 'https:'],
        'object-src': ["'none'"],
        'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        'style-src': ["'self'", 'https:', "'unsafe-inline'"],
        'upgrade-insecure-requests': true
      },
      crossOriginEmbedderPolicy: process.env.NODE_ENV === 'development' ? 'unsafe-none' : 'require-corp',
      referrerPolicy: 'no-referrer',
      strictTransportSecurity: { maxAge: 31536000, includeSubdomains: true },
      xContentTypeOptions: 'nosniff',
      xFrameOptions: 'DENY',
      xXSSProtection: '1; mode=block'
    },

    corsHandler: {
      origin: process.env.NODE_ENV === 'development'
        ? ['http://localhost:3000', 'http://127.0.0.1:3000']
        : process.env.CORS_ORIGIN?.split(','),
      methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
      credentials: true
    },

    rateLimiter: { tokensPerInterval: 150, interval: 300000, throwError: true },
    hidePoweredBy: true
  },

  routeRules: {
    '/api/**': {
      headers: { 'Access-Control-Max-Age': '86400' }
    }
  },

  site: { url: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000', defaultLocale: 'fr' },
  seo: { meta: { twitterCard: 'summary_large_image' } },

  compatibilityDate: '2025-09-13'
})
