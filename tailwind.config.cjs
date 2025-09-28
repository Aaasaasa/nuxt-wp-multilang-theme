// tailwind.config.js (root monorepo)
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // koristi .dark klasu za switch
  content: [
    './app/web/**/*.{vue,js,ts,html}',
    './app/admin/**/*.{vue,js,ts,html}',
    './shared/**/*.{vue,js,ts,html}'
  ],
  theme: {
    extend: {
      // globalna proširenja (ako hoćeš da se dele između svih app)
      borderRadius: {
        '2xl': '1rem'
      }
    }
  },
  plugins: [
    // require('@tailwindcss/typography'),
    // require('tailwindcss-animate')
  ]
}
