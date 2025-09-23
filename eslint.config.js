// eslint.config.js

// ✅ ESLint core rules (JavaScript standardni set)
import js from "@eslint/js"

// ✅ TypeScript plugin + parser
import tseslint from "@typescript-eslint/eslint-plugin"
import tsParser from "@typescript-eslint/parser"

// ✅ Vue i Nuxt plugini
import vue from "eslint-plugin-vue"
import nuxt from "eslint-plugin-nuxt"
import vueParser from "vue-eslint-parser"

export default [
  // 1. 📌 Standardni JS rules
  js.configs.recommended,

  // 2. 📌 Ignorisani folderi (da ESLint ne ulazi u build output, cache i vendor)
  {
    ignores: [
      "node_modules/**",
      ".nuxt/**",
      ".nitro/**",
      "dist/**",
      "coverage/**",
      ".docker/**",
      ".output/**",
      ".turbo/**"
    ]
  },

  // 3. 📌 Pravila za kod (*.js, *.ts, *.vue)
  {
    files: ["**/*.{js,ts,vue}"],

    // Parser podešavanja
    languageOptions: {
      parser: vueParser, // ⬅️ koristi vue-eslint-parser
      parserOptions: {
        parser: tsParser, // ⬅️ za <script lang="ts">
        ecmaVersion: "latest",
        sourceType: "module",
        extraFileExtensions: [".vue"]
      }
    },

    // Aktivni plugini
    plugins: {
      "@typescript-eslint": tseslint,
      vue,
      nuxt
    },

    // Pravila
    rules: {
      // 🔧 TypeScript
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" }
      ],
      "@typescript-eslint/no-explicit-any": "off",

      // 🔧 Vue / Nuxt
      "vue/multi-word-component-names": [
        "error",
        {
          // Dozvoljene single-word komponente/layouts/pages
          ignores: [
            "index", "[...slug]", "[slug]",
            "default", "error", "admin", "dashboard",
            "login", "about", "edit", "Card"
          ]
        }
      ],

      // 🔧 General rules
      "no-empty": "off",   // prazni blokovi nisu error
      "no-console": "off", // dozvoljavamo console.log
      "no-undef": "off"    // isključeno jer Nuxt dodaje globalne stvari
    }
  }
]
