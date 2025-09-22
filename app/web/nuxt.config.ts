// app/web/nuxt.config.ts

/*
ovo sada radi:
import { helper } from "#shared/utils"
import { User } from "@local/shared/models/user"

*/
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
    '@nuxtjs/seo',
    '@pinia/nuxt',
    'nuxt-auth-utils'
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
      { code: 'it', name: 'Italy', files: ['it/common.json', 'it/seo.json'], language: 'it-IT', flag: 'i-openmoji:flag-italy' }
    ],
    langDir: 'i18n/',
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
    plugins: [tsconfigPaths()],
    esbuild: {
      target: 'esnext' // Ensure modern ES module support
    }
  },
  security: {
    headers: {
      contentSecurityPolicy: {
        'base-uri': ["'self'"],
        'font-src': ["'self'", 'https:', 'data:'],
        'form-action': ["'self'"],
        'img-src': ["'self'", 'data:', 'https:'],
        'script-src': ["'self'", "'unsafe-inline'"],
        'style-src': ["'self'", 'https:', "'unsafe-inline'"],
        'upgrade-insecure-requests': true
      },
      referrerPolicy: 'strict-origin-when-cross-origin',
      xContentTypeOptions: 'nosniff',
      xFrameOptions: 'SAMEORIGIN',
      xXSSProtection: '1; mode=block'
    },
    corsHandler: {
      origin: process.env.NODE_ENV === 'development'
        ? ['http://localhost:3000', 'http://127.0.0.1:3000']
        : process.env.CORS_ORIGIN?.split(','),
      methods: ['GET', 'HEAD', 'POST'],
      credentials: true
    },
    rateLimiter: { tokensPerInterval: 200, interval: 300000, throwError: true },
    hidePoweredBy: true
  },
  site: { url: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000', defaultLocale: 'de' },
  seo: { meta: { twitterCard: 'summary_large_image' } },
  compatibilityDate: '2025-09-13'
});
