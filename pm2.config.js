module.exports = {
  apps: [
    {
      name: 'nuxt-wp-multilang-theme',
      exec_mode: 'cluster',
      instances: 'max',
      script: './.output/server/index.mjs',
      env: {
        NODE_ENV: 'production',
        NITRO_PORT: 3000,
        HOST: '0.0.0.0'
      }
    }
  ]
};
