import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  ssr: true,
  devtools: { enabled: false },
  srcDir: '.',
  serverDir: '.',
  app: {},
  modules: [],
  nitro: {
    preset: 'node-server',
    serveStatic: false
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
