import { defineNuxtConfig } from 'nuxt/config'
import { resolve } from 'node:path'

export default defineNuxtConfig({
  // name:'server',
  // ssr: true,
  devtools: { enabled: false },
  rootDir: resolve(__dirname, '..'),
  srcDir: 'server',
  // sserverDir: 'server',
  app: {},
  modules: [],
  nitro: {
    preset: 'node-server',
    esnext: true,
    noExternals: false,
    compatibilityDate: '2024-10-01',
    // serveStatic: false
  },
  alias: {
    '~': resolve(__dirname, '.'),
    '#': resolve(__dirname, '..'),
    '@': resolve(__dirname, '.'),
    '@shared': resolve(__dirname, '../packages/shared'),
    '@utils': resolve(__dirname, '../packages/utils')
  },
  typescript: {
    tsConfig: {
      compilerOptions: {
        baseUrl: '.',
        paths: {
          '~/*': ['./*'],
          '@/*': ['./*']
        }
      }
    }
  },
  compatibilityDate: '2024-10-06'
})
