import js from '@eslint/js'
import importX from 'eslint-plugin-import-x'
import noUnsanitized from 'eslint-plugin-no-unsanitized'
import security from 'eslint-plugin-security'
import unicorn from 'eslint-plugin-unicorn'
import tseslint from 'typescript-eslint'

export default [
  { ignores: ['dist'] },
  js.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
  },
  {
    plugins: { import: importX },
    rules: {
      // Import ordering
      'import/order': [
        'error',
        {
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
      'import/newline-after-import': 'error',
      'import/first': 'error',

      // Correctness
      'import/no-self-import': 'error',
      'import/no-extraneous-dependencies': 'error',

      // `consistent-type-imports` decides WHETHER to use `import type`;
      // `consistent-type-specifier-style` enforces top-level form over inline.
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
      'import/consistent-type-specifier-style': ['error', 'prefer-top-level'],

      // Numbers stringify predictably — casting to String() everywhere is pointless noise
      '@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true }],
    },
  },
  unicorn.configs.recommended,
  {
    rules: {
      'unicorn/prevent-abbreviations': 'off',
      'unicorn/filename-case': 'off',
      'unicorn/no-array-reduce': 'off',
      'unicorn/no-array-callback-reference': 'off',
    },
  },
  security.configs.recommended,
  noUnsanitized.configs.recommended,
  // Fires on all bracket-notation reads (e.g. map lookups) — too broad to be actionable
  { rules: { 'security/detect-object-injection': 'off' } },
]
