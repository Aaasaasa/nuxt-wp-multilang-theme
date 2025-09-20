/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/web/**/*.{vue,js,ts,html}',
    './app/admin/**/*.{vue,js,ts,html}',
    './shared/**/*.{vue,js,ts,html}'
  ],
  theme: {
    extend: {}
  },
  plugins: [
//    require('@tailwindcss/typography'),
//    require('tailwindcss-animate')
  ]
}
