import js from "@eslint/js"
import tseslint from "@typescript-eslint/eslint-plugin"
import parser from "@typescript-eslint/parser"
import vue from "eslint-plugin-vue"
import nuxt from "eslint-plugin-nuxt"

export default [
  // ⬅️ prvo poseban blok za ignores
  {
    ignores: [
      "node_modules/**",
      ".nuxt/**",
      ".nitro/**",
      "dist/**",
      "coverage/**",
      ".docker/**"
    ]
  },

  js.configs.recommended,

  {
    files: ["**/*.{js,ts,vue}"],
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
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" }
      ],
      "@typescript-eslint/no-explicit-any": "off",

      // 🔧 Vue/Nuxt rules
      "vue/multi-word-component-names": [
        "error",
        { ignores: ["index", "[...slug]", "[slug]"] }
      ],

      // 🔧 General rules
      "no-empty": "off",
      "no-console": "off",
      "no-undef": "off"
    }
  }
]
