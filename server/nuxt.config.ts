import tsconfigPaths from "vite-tsconfig-paths";

export default defineNuxtConfig({
  // Basic Nuxt config for admin app
  vite: {
    plugins: [tsconfigPaths()],
   },
  compatibilityDate: '2025-09-13',
  // Add auth, Prisma, etc., integrations as needed
})
