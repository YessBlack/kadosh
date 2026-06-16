import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      // --- comillas ---
      'quotes': ['error', 'single', { avoidEscape: true }],
      'jsx-quotes': ['error', 'prefer-single'],

      // --- punto y coma ---
      'semi': ['error', 'never'],
      'semi-spacing': ['error', { before: false, after: true }],

      // --- espacios ---
      'space-before-function-paren': "off",
      'space-before-blocks': ['error', 'always'],
      'space-infix-ops': 'error',
      'space-in-parens': ['error', 'never'],
      'keyword-spacing': ['error', { before: true, after: true }],
      'object-curly-spacing': ['error', 'always'],
      'array-bracket-spacing': ['error', 'never'],
      'comma-spacing': ['error', { before: false, after: true }],
      'key-spacing': ['error', { beforeColon: false, afterColon: true }],
      'arrow-spacing': ['error', { before: true, after: true }],
      'no-multi-spaces': 'error',

      // --- líneas vacías ---
      'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0, maxBOF: 0 }],
      'eol-last': ['error', 'always'],
      'no-trailing-spaces': 'error',

      // --- comas ---
      'comma-dangle': ['error', 'never'],
      'comma-style': ['error', 'last'],

      // --- buenas prácticas ---
      'eqeqeq': ['error', 'always'],
      'no-var': 'error',
      'prefer-const': 'error',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],

      // --- react ---
      'react/react-in-jsx-scope': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      'react-refresh/only-export-components': 'off',
    },
  },
])