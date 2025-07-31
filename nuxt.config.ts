
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
      prefix: process.env.DB_PREFIX
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
          const mysql = await import('mysql2/promise');
          const connection = await mysql.createConnection({
            host: config.db.host,
            user: config.db.user,
            password: config.db.password,
            database: config.db.database
          });
          const [rows] = await connection.execute(
            `SELECT ID, user_login, user_email FROM ${config.db.prefix || 'wp_'}users WHERE user_login = ? AND user_pass = MD5(?)`,
            [credentials.username, credentials.password]
          );
          if (rows.length > 0) {
            return {
              id: rows[0].ID,
              name: rows[0].user_login,
              email: rows[0].user_email,
              role: 'admin'
            }
          }
          return null;
        }
      }
    }
  }
});
