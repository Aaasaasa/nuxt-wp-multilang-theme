/* eslint-disable quotes */
// nuxt.config.ts
import packageJson from './package.json'
import { resolve } from 'path'

export default defineNuxtConfig({
  // ========================================
  // Core Configuration
  // ========================================
  compatibilityDate: '2025-07-16',

  devtools: {
    enabled: true,
    timeline: { enabled: true }
  },

  // ========================================
  // Modules
  // ========================================
  modules: [
    // UI & Styling
    '@nuxt/ui',
    '@nuxt/image',

    // Development & Quality
    '@nuxt/eslint',
    '@nuxt/test-utils/module',

    // Internationalization & SEO
    '@nuxtjs/i18n',
    '@nuxtjs/seo',

    // Database & Backend
    '@prisma/nuxt',
    'nuxt-auth-utils',
    'nuxt-nodemailer',

    // Security & State Management
    'nuxt-security',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',

    // Dev Tools
    'nuxt-mcp'
  ],

  // ========================================
  // App & Meta Configuration
  // ========================================
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      titleTemplate: '%s | Stajic Platform',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'format-detection', content: 'telephone=no' }
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
    }
  },

  // ========================================
  // i18n Configuration
  // ========================================
  i18n: {
    langDir: 'locales',
    locales: [
      {
        code: 'en',
        name: 'English',
        files: ['en/common.json', 'en/seo.json', 'en/email.json'],
        language: 'en-US'
      },
      {
        code: 'de',
        name: 'Deutsch',
        files: ['de/common.json', 'de/seo.json', 'de/email.json'],
        language: 'de-DE'
      },
      {
        code: 'sr',
        name: 'Српски',
        files: ['sr/common.json', 'sr/seo.json', 'sr/email.json'],
        language: 'sr-RS'
      }
    ],
    defaultLocale: 'en',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root'
    },
    experimental: {
      localeDetector: 'localeDetector.ts'
    }
  },

  // ========================================
  // Styling
  // ========================================
  css: ['/assets/css/main.css'],

  // ========================================
  // Auto-imports (clean)
  // ========================================
  imports: {
    dirs: [
      'composables/**',
      'server/utils/**',
      'shared/**'
    ]
  },

  // Zod auto-import (modern syntax)
  hooks: {
    'imports:extend': (imports) => {
      imports.push({
        from: 'zod',
        name: 'z'
      })
    }
  },

  // ========================================
  // Nitro Configuration
  // ========================================
  nitro: {
    alias: {
      '@pgClient': resolve('./prisma/generated/postgres-cms/index.js'),
      '@wpClient': resolve('./prisma/generated/mysql/index.js'),
      '@mongoClient': resolve('./prisma/generated/mongo/index.js')
    },
    imports: {
      dirs: [
        'shared/**',
        'server/constants/**',
        'server/services/**',
        'server/utils/**',
        'server/types/**'
      ]
    },
    serverAssets: [{ baseName: 'templates', dir: './templates' }],
    rollupConfig: {
      watch: {
        exclude: ['data/**', 'data/mongo/**', '**/data/postgres/**', '**/data/mysql/**' ]
      }
    }
  },

  // ========================================
  // Vite Configuration
  // ========================================
  vite: {
    resolve: {
      alias: {
        //  '.prisma/client/index-browser': './node_modules/.prisma/client/index-browser.js'
        'prisma/generated/postgres-cms/index-browser.js': './node_modules/.prisma/client/index-browser.js'
      }
    },
    build: { chunkSizeWarningLimit: 600 },
    server: { watch: { ignored: ['**/data/**', '**/node_modules/**', '**/.nuxt/**'] } }
  },

  // ========================================
  // Security
  // ========================================
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
        'upgrade-insecure-requests': false
      },
      crossOriginEmbedderPolicy: 'unsafe-none',
      referrerPolicy: 'no-referrer',
      strictTransportSecurity: false,
      xContentTypeOptions: 'nosniff',
      xFrameOptions: 'DENY',
      xXSSProtection: '1; mode=block',
      crossOriginOpenerPolicy: false,
      originAgentCluster: false
    },
    corsHandler: false,
    rateLimiter: {
      tokensPerInterval: 150,
      interval: 5 * 60 * 1000,
      throwError: true
    },
    hidePoweredBy: true
  },

  // ========================================
  // Routing
  // ========================================
  routeRules: {
    '/api/**': {
      cors: true,
      headers: { 'Access-Control-Max-Age': '86400' }
    },
    '/lab/**': { ssr: false },
    '/admin/**': { ssr: false }
  },

  // ========================================
  // SEO
  // ========================================
  seo: {
    meta: { twitterCard: 'summary_large_image' }
  },

  // ========================================
  // Runtime Config
  // ========================================
  runtimeConfig: {
    nodemailer: {
      host: '',
      port: 587,
      auth: { user: '', pass: '' },
      from: ''
    },
    rateLimit: {
      loginMax: 5,
      loginWindow: 15,
      tokenCooldown: 5
    },
    public: {
      version: packageJson.version
    }
  }
})
