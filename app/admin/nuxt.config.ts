// app/admin/nuxt.config.ts
import tailwindcss from '@tailwindcss/postcss'
import tsconfigPaths from 'vite-tsconfig-paths'
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

  // App Configuration
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

  // I18n Configuration (ostavljeno tvoje)
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
      extensions: ['vue'], // registriraj SAMO .vue komponente
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
    icons: ['lucide', 'openmoji'] // ili samo lucide
  },

  vite: {
    plugins: [tailwindcss(), tsconfigPaths()],
    resolve: {
      alias: {
        // ako koristiš browser build za prisma (bilo gde) — čuvamo alias, ali PRISMA paket NEMA biti u modules
        '.prisma/client/index-browser': './node_modules/.prisma/client/index-browser.js'
      }
    },
  },

  compatibilityDate: '2025-09-13'
})
