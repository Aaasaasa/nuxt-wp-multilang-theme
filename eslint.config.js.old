// eslint.config.js

import js from "@eslint/js"
import tseslint from "@typescript-eslint/eslint-plugin"
import tsParser from "@typescript-eslint/parser"
import vue from "eslint-plugin-vue"
import nuxt from "eslint-plugin-nuxt"
import vueParser from "vue-eslint-parser"

// ✅ Prettier
import prettier from "eslint-plugin-prettier"
import prettierConfig from "eslint-config-prettier"

export default [
  js.configs.recommended,

  // 📌 Ignorisani folderi
  {
    ignores: [
      "node_modules/**",
      ".nuxt/**",
      ".nitro/**",
      "dist/**",
      "coverage/**",
      ".docker/**",
      ".output/**",
      ".turbo/**",
    ],
  },

  // 📌 Pravila za kod
  {
    files: ["**/*.{js,ts,vue}"],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
        ecmaVersion: "latest",
        sourceType: "module",
        extraFileExtensions: [".vue"]
      }
    },
    plugins: {
      "@typescript-eslint": tseslint,
      vue,
      nuxt,
      prettier // ⬅️ Prettier plugin
    },
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
          ignores: [
            "index", "[...slug]", "[slug]",
            "default", "error", "admin", "dashboard",
            "login", "about", "edit", "Card"
          ]
        }
      ],

      // 🔧 General
      "no-empty": "off",
      "no-console": "off",
      "no-undef": "off",

      // 🔧 Prettier
      "prettier/prettier": "warn",
      //disable semicolon off
      semi: ["off"],
    },
  },

  // 📌 Isključi ESLint rules koje Prettier već pokriva
  prettierConfig,
]
