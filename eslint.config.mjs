// eslint.config.mjs

import js from '@eslint/js'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import vue from 'eslint-plugin-vue'
import nuxt from 'eslint-plugin-nuxt'

export default [
  // ❌ Ignoriši build i cache foldere
  {
    ignores: [
      'node_modules/**',
      '.nuxt/**',
      '.nitro/**',
      '.output/**',
      '.turbo/**',
      'dist/**',
      'coverage/**',
      '*.log',
      '*.d.ts',
    ],
  },

  // ✅ Osnovne JS pravila
  js.configs.recommended,

  // ✅ TypeScript, Vue i Nuxt pravila
  {
    files: ['**/*.{ts,js,vue}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: ['./tsconfig.json'], // ili .tsconfig.base.json ako koristiš extends
      },
      globals: {
        // Vue/Nuxt
        defineNuxtConfig: 'readonly',
        defineNuxtPlugin: 'readonly',
        defineNuxtRouteMiddleware: 'readonly',
        defineAppConfig: 'readonly',
        defineI18nConfig: 'readonly',

        // Vue
        ref: 'readonly',
        reactive: 'readonly',
        computed: 'readonly',
        watch: 'readonly',
        defineProps: 'readonly',
        defineEmits: 'readonly',
        defineExpose: 'readonly',
        withDefaults: 'readonly',

        // Composables
        useState: 'readonly',
        useAsyncData: 'readonly',
        useFetch: 'readonly',
        useRuntimeConfig: 'readonly',
        useNuxtApp: 'readonly',
        useSeoMeta: 'readonly',
        useI18n: 'readonly',
        useToast: 'readonly',

        // Nitro
        defineEventHandler: 'readonly',
        readBody: 'readonly',
        getQuery: 'readonly',
        createError: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      vue,
      nuxt,
    },
    rules: {
      // ⚙️ Pravila koja dozvoljavaju opušteniji rad
      'no-console': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',

      // 💄 Vue specifična pravila
      'vue/multi-word-component-names': [
        'error',
        { ignores: ['index', '[slug]', '[...slug]'] },
      ],

      // ✅ Prettier friendly
      'prettier/prettier': 'off',
    },
  },
]
