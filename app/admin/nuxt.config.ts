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
import { defineNuxtConfig } from 'nuxt/config';
import { fileURLToPath } from 'node:url';

export default defineNuxtConfig({
  typescript: {
    shim: false
  },
  modules: [
    '@nuxt/ui',
    '@nuxt/image',
    '@nuxtjs/i18n',
    '@pinia/nuxt',
    'nuxt-auth-utils',
    'nuxt-security',
    'pinia-plugin-persistedstate/nuxt'
  ],
  alias: {
    '~': fileURLToPath(new URL('.', import.meta.url)),
    '~~': fileURLToPath(new URL('../../shared', import.meta.url))
  },
  app: {
    head: {
      htmlAttrs: { lang: 'de' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'robots', content: 'noindex, nofollow' } // Prevent indexing
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
      { code: 'it', name: 'Italy', files: ['it/common.json', 'it/seo.json'], language: 'it-IT', flag: 'i-openmoji:flag-italy' }
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
  postcss: {
    plugins: {
      '@tailwindcss/postcss': {},
      autoprefixer: {}
    }
  },
  ui: {
    icons: ['lucide', 'openmoji']
  },
  vite: {
    plugins: [require('vite-tsconfig-paths')()]
  },
  security: {
    headers: {
      contentSecurityPolicy: {
        'base-uri': ["'self'"],
        'font-src': ["'self'", 'data:'],
        'form-action': ["'self'"],
        'frame-ancestors': ["'none'"],
        'img-src': ["'self'", 'data:'],
        'object-src': ["'none'"],
        'script-src': ["'self'"],
        'style-src': ["'self'", "'unsafe-inline'"],
        'upgrade-insecure-requests': true
      },
      crossOriginEmbedderPolicy: 'require-corp',
      crossOriginOpenerPolicy: 'same-origin',
      crossOriginResourcePolicy: 'same-origin',
      referrerPolicy: 'no-referrer',
      strictTransportSecurity: { maxAge: 31536000, includeSubdomains: true, preload: true },
      xContentTypeOptions: 'nosniff',
      xFrameOptions: 'DENY',
      xXSSProtection: '1; mode=block'
    },
    corsHandler: {
      origin: process.env.NODE_ENV === 'development'
        ? ['http://localhost:3300']
        : [process.env.ADMIN_URL].filter(Boolean),
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      credentials: true,
      maxAge: 86400
    },
    rateLimiter: { tokensPerInterval: 100, interval: 300000, throwError: true },
    hidePoweredBy: true,
    requestSizeLimiter: { maxRequestSizeInBytes: 2000000, maxUploadFileRequestInBytes: 8000000 },
    allowedMethodsRestricter: { methods: ['GET', 'POST', 'PUT', 'DELETE'] }
  },
  routeRules: {
    '/api/**': { cors: true, headers: { 'Access-Control-Max-Age': '86400' } },
    '/admin/**': { middleware: ['auth'] } // Enforce authentication
  },
  compatibilityDate: '2025-09-13'
});
