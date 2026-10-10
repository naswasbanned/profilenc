import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      // `motion`/`m` are only referenced as <motion.div>/<m.div>, which this rule cannot see without eslint-plugin-react
      'no-unused-vars': ['error', { varsIgnorePattern: '^([A-Z_]|motion$|m$)', argsIgnorePattern: '^_' }],
      // Dev-only HMR hint, not a correctness issue; keep it visible without failing lint
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },
  {
    files: ['server/**/*.js'],
    languageOptions: { globals: globals.node },
  },
])
