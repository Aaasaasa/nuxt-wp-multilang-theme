import { defineNuxtConfig } from 'nuxt/config';
import dotenv from 'dotenv';

dotenv.config();

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
    public: {}
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
          const mysql = await import('mysql2/promise');
          const dotenv = await import('dotenv');
          dotenv.config();

          const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
          });

          const [rows] = await connection.execute(
            `SELECT ID, user_login, user_email, user_registered FROM ${process.env.DB_PREFIX || 'wp_'}users WHERE user_login = ? AND user_pass = MD5(?)`,
            [credentials.username, credentials.password]
          );

          if (rows.length > 0) {
            const [roles] = await connection.execute(
              `SELECT meta_value FROM ${process.env.DB_PREFIX || 'wp_'}usermeta WHERE user_id = ? AND meta_key = ?`,
              [rows[0].ID, `${process.env.DB_PREFIX || 'wp_'}capabilities`]
            );

            const roleData = roles.length > 0 ? JSON.parse(roles[0].meta_value) : {};
            const role = Object.keys(roleData)[0] || 'subscriber';

            return {
              id: rows[0].ID,
              name: rows[0].user_login,
              email: rows[0].user_email,
              registered: rows[0].user_registered,
              role
            };
          }

          return null;
        }
      }
    }
  }
});