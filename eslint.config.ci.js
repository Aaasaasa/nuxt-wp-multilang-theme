// ROOT/eslint.config.ci.js
import base from "./eslint.config.js";
export default base.map((cfg) => {
  // if (cfg.ignores) return { ...cfg, ignores: [] }           // CI ne preskače ništa
  // if (cfg.rules) return { ...cfg, rules: { ...cfg.rules, 'no-console':'error','no-debugger':'error' } }
  return cfg;
})
