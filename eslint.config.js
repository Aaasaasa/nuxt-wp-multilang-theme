import js from "@eslint/js"
import tseslint from "typescript-eslint"
import vue from "eslint-plugin-vue"

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...vue.configs["flat/recommended"],

  {
    files: ["**/*.{js,ts,vue}"],
    ignores: [
      "node_modules/**",
      ".nuxt/**",
      "dist/**",
      "coverage/**",
      "prisma/generated/**"
    ],
    languageOptions: {
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module"
      }
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "vue/multi-word-component-names": [
        "error",
        { ignores: ["index", "[...slug]", "[slug]"] }
      ]
    }
  },
]

