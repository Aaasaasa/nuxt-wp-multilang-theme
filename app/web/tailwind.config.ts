// app/web/tailwind.config.js
const base = require('../../tailwind.config.js')

module.exports = {
  ...base,
  content: ['./app/web/**/*.{vue,js,ts,html}', './shared/**/*.{vue,js,ts,html}'],
  theme: {
    ...base.theme,
    extend: {
      ...base.theme?.extend,
      colors: {
        brand: '#4f46e5' // Web-specific (npr. plava)
      }
    }
  }
}
