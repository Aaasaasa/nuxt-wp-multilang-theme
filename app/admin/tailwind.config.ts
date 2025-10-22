// app/admin/tailwind.config.js
const base = require('../../tailwind.config.js')

module.exports = {
  ...base,
  content: ['./app/admin/**/*.{vue,js,ts,html}', './shared/**/*.{vue,js,ts,html}'],
  theme: {
    ...base.theme,
    extend: {
      ...base.theme?.extend,
      colors: {
        brand: '#e11d48' // Admin-specific (npr. crvena)
      }
    }
  }
}
