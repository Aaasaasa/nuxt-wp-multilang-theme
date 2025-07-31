export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/i18n',
    '@sidebase/nuxt-auth',
  ],
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      apiBase: 'https://your-wordpress-domain.com/wp-json/wp/v2'
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
      { code: 'de', iso: 'de-DE', file: 'de.json', name: 'Deutsch' },
      { code: 'en', iso: 'en-US', file: 'en.json', name: 'English' },
      { code: 'sr', iso: 'sr-RS', file: 'sr.json', name: 'Српски' }
    ],
    lazy: true,
    langDir: 'lang/',
    defaultLocale: 'de'
  }
});
