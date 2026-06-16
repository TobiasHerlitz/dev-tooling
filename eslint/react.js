import eslintReact from '@eslint-react/eslint-plugin'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import globals from 'globals'

import base from './base.js'

export default [
  ...base,
  eslintReact.configs['recommended-typescript'],
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: { globals: globals.browser },
    plugins: { 'react-hooks': reactHooks, 'react-refresh': reactRefresh },
    rules: {
      ...reactHooks.configs.recommended.rules,
      // Required for Vite HMR fast refresh to work correctly
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },
]
