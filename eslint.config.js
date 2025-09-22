import js from "@eslint/js"
import tseslint from "@typescript-eslint/eslint-plugin"
import parser from "@typescript-eslint/parser"
import vue from "eslint-plugin-vue"
import nuxt from "eslint-plugin-nuxt"

export default [
  js.configs.recommended,
  {
    files: ["**/*.{js,ts,vue}"],
    ignores: [
      "node_modules/**",
      ".nuxt/**",
      "dist/**",
      "coverage/**",
      ".docker/**"],
    languageOptions: {
      parser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module"
      }
    },
    plugins: {
      "@typescript-eslint": tseslint,
      vue,
      nuxt
    },
    rules: {
      // 🔧 TypeScript rules
      "no-unused-vars": "off", // isključi core rule
      "@typescript-eslint/no-unused-vars": [
        "warn", // ⚠️ samo warning, nikad error
        { argsIgnorePattern: "^_" }
      ],
      "@typescript-eslint/no-explicit-any": "off",

      // 🔧 Vue/Nuxt rules
      "vue/multi-word-component-names": [
        "error",
        { ignores: ["index", "[...slug]", "[slug]"] }
      ],

      // 🔧 General rules (opušteno u dev fazi)
      "no-empty": "off",
      "no-console": "off",
      "no-undef": "off"
    }
  }
]
