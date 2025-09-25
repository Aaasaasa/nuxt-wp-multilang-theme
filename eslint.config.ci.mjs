// eslint.config.ci.mjs
import config from './eslint.config.mjs' // assert { type: 'json' }

export default config.map((entry) => {
  if (entry.rules) {
    return {
      ...entry,
      rules: {
        ...entry.rules,
        'no-console': 'off',
        'no-debugger': 'error',
      },
    }
  }
  return entry
})
