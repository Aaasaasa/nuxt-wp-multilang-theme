// eslint.config.ts

import js from '@eslint/js'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import vue from 'eslint-plugin-vue'
import nuxt from 'eslint-plugin-nuxt'
import vueParser from 'vue-eslint-parser'

export default [
  // ❌ Ignoriši build i cache foldere
  {
    ignores: [
      "**/node_modules/**",
      "**/.nuxt/**",
      "**/.nitro/**",
      "**/.output/**",
      "dist/**",
      ".git/**",
      '.output/**',
      '.turbo/**',
      'dist/**',
      'coverage/**',
      '*.log',
      '*.d.ts',
      'test/**',
    ],
  },

  // ✅ Osnovna JS pravila
  js.configs.recommended,

  // ✅ TypeScript + Vue + Nuxt (typed linting)
  {
    files: ['app/**/*.{ts,vue}', 'server/**/*.{ts,vue}', 'shared/**/*.{ts,vue}'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: ['./tsconfig.base.json'],   // typed linting samo ovde
        extraFileExtensions: ['.vue'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      vue,
      nuxt,
    },
    rules: {
      'no-console': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',

      'vue/multi-word-component-names': [
        'error',
        {
          ignores: [
            'index',
            '[...slug]',
            '[slug]',
            'default',
            'error',
            'admin',
            'dashboard',
            'login',
            'about',
            'edit',
            'Card',
          ],
        },
      ],

      'no-empty': 'off',
      'no-undef': 'off',
      'prettier/prettier': 'off',
    },
  },

  // ✅ Plain JS ili fallback (bez type info)
  {
    files: ['**/*.js'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: null,   // 🚫 isključi typed linting za .js
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
]
