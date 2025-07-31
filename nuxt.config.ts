export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/i18n',
    '@sidebase/nuxt-auth'
  ],
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    apiSecret: process.env.API_SECRET,
    db: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },
    public: {
      apiBase: process.env.API_BASE_URL || 'http://localhost:8000/wp-json/wp/v2'
    }
  },
  app: {
    head: {
      title: 'Stajic Web',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ]
    }
  },
  i18n: {
    locales: [
      { code: 'de', language: 'de-DE', file: 'de.json', name: 'Deutsch' },
      { code: 'en', language: 'en-US', file: 'en.json', name: 'English' },
      { code: 'sr', language: 'sr-RS', file: 'sr.json', name: 'Српски / Srpski' }
    ],
    lazy: true,
    langDir: 'lang/',
    defaultLocale: 'de'
  },
  auth: {
    origin: process.env.AUTH_ORIGIN || 'http://localhost:3000',
    enableGlobalAppMiddleware: true,
    session: {
      strategy: 'jwt'
    },
    providers: {
      credentials: {
        authorize: async (credentials) => {
          const config = useRuntimeConfig();
          if (
            credentials.username === 'admin' &&
            credentials.password === config.apiSecret
          ) {
            return { id: 1, name: 'Admin', role: 'admin' }
          }
          return null;
        }
      }
    }
  }
});