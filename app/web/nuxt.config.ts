export default defineNuxtConfig({
  // Basic Nuxt config for admin app
  devtools: { enabled: true },
  modules: ['@nuxtjs/i18n'],
  css: ['~/assets/css/admin.css'],
  // Add auth, Prisma, etc., integrations as needed
})
