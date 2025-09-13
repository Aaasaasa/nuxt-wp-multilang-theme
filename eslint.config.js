import js from "@eslint/js"
import ts from "typescript-eslint"
import vue from "eslint-plugin-vue"

export default [
  js.configs.recommended,
  ...ts.configs.recommended,
  ...vue.configs["flat/recommended"],
  {
    files: ["**/*.{js,ts,vue}","tests/**/*.ts"],
    ignores: [
      "node_modules/**",
      ".nuxt/**",
      "dist/**",
      "coverage/**",
      "prisma/generated/**",   // 👉 generierte Dateien ignorieren
    ],
    languageOptions: {
      globals: {
        console: "readonly",
        fetch: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        TextEncoder: "readonly",
        TextDecoder: "readonly",
        atob: "readonly",
        btoa: "readonly",
        WebAssembly: "readonly",
      },
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    rules: {
      // Strenge Regeln lockern
      // "@typescript-eslint/no-explicit-any": "warn", // nur Warnung statt Error
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
      "no-empty": "off",
      "no-console": "off",
      "no-undef": "off",
    },
  },
]
