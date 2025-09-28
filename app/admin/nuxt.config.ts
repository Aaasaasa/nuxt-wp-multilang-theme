import { defineNuxtConfig } from 'nuxt/config'
import tsconfigPaths from 'vite-tsconfig-paths'
import { fileURLToPath } from 'node:url'

const isDev = process.env.NODE_ENV !== 'production'


export default defineNuxtConfig({
  devtools: { enabled: true },
  // plugins: [tsconfigPaths()],
  typescript: { shim: true },

  modules: [
    '@nuxt/ui',
    '@nuxt/image',
    '@nuxtjs/i18n',
    '@nuxtjs/color-mode',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    'nuxt-security'
  ],

  css: ['~/assets/css/tailwind.css'],

  components: [{ path: '~/components', extensions: ['vue'], pathPrefix: false }],

  postcss: {
    plugins: {
      '@tailwindcss/postcss': {},
      autoprefixer: {}
    }
  },

  ui: { icons: ['lucide', 'openmoji'] },

  colorMode: {
    preference: 'system',   // default tema (system/light/dark)
    fallback: 'light',      // kad nema system support
    classSuffix: '',         // važno: da koristi samo .dark, bez .dark-mode
    componentName: 'ColorScheme',
    classPrefix: '',
    storage: 'localStorage', // or 'sessionStorage' or 'cookie'
    storageKey: 'nuxt-color-mode'
  },

  i18n: {
    locales: [
      {
        code: 'de',
        name: 'Deutsch',
        files: ['de/common.json', 'de/seo.json'],
        language: 'de-DE',
        flag: 'i-openmoji:flag-germany'
      },
      {
        code: 'en',
        name: 'English',
        files: ['en/common.json', 'en/seo.json'],
        language: 'en-US',
        flag: 'i-openmoji:flag-united-states'
      },
      {
        code: 'sr',
        name: 'Србски',
        files: ['sr/common.json', 'sr/seo.json'],
        language: 'sr-SR',
        flag: 'i-openmoji:flag-serbia'
      },
      {
        code: 'ru',
        name: 'Russia',
        files: ['ru/common.json', 'ru/seo.json'],
        language: 'ru-RU',
        flag: 'i-openmoji:flag-russia'
      },
      {
        code: 'es',
        name: 'Español',
        files: ['es/common.json', 'es/seo.json'],
        language: 'es-ES',
        flag: 'i-openmoji:flag-spain'
      },
      {
        code: 'it',
        name: 'Italy',
        files: ['it/common.json', 'it/seo.json'],
        language: 'it-IT',
        flag: 'i-openmoji:flag-italy'
      }
    ],
    defaultLocale: 'de',
    strategy: 'prefix_except_default'
  },

  // ako budeš trebao alias: koristi TS paths (tsconfigPaths) umjesto ručnog aliasa
  alias: {
        // Laufzeit-Alias für shared (passt zu deinem @@shared Pfad)
    '@@shared': fileURLToPath(new URL('../../shared', import.meta.url)),
    '@@shared/': fileURLToPath(new URL('../../shared/', import.meta.url))

  },

  vite: {
    plugins: [tsconfigPaths()],
    define: {
      // zaštita od jiti fallback-a koji koristi import.meta.require
      'import.meta.require': undefined
    }
  },

  security: {
    headers: {
      contentSecurityPolicy: isDev
        ? false // 🔓 dev = CSP isključen, sve radi
        : {
            'default-src': ["'self'"],
            'img-src': ["'self'", 'data:', 'https:'],
            'style-src': ["'self'", "'unsafe-inline'"],
            'script-src': ["'self'"], // ⚠️ u prod NE stavljaj unsafe-inline
            'font-src': ["'self'", 'data:'],
            'connect-src': ["'self'", 'https:'],
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
      origin: isDev
        ? ['http://localhost:3300', 'http://localhost:3000', 'http://localhost:4000']
        : [process.env.ADMIN_URL].filter(Boolean),
      credentials: true
    },
    rateLimiter: { tokensPerInterval: 100, interval: 300000, throwError: true },
    requestSizeLimiter: { maxRequestSizeInBytes: 2000000, maxUploadFileRequestInBytes: 8000000 },
    hidePoweredBy: true
  },

  routeRules: {
    '/api/**': { cors: true, headers: { 'Access-Control-Max-Age': '86400' } }
  },

  compatibilityDate: '2025-09-13'
})
