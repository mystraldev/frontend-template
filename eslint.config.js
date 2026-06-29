import js from '@eslint/js'
import reactX from '@eslint-react/eslint-plugin'
import vitest from '@vitest/eslint-plugin'
import prettier from 'eslint-config-prettier'
import importX from 'eslint-plugin-import-x'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import noUnsanitized from 'eslint-plugin-no-unsanitized'
import perfectionist from 'eslint-plugin-perfectionist'
import playwright from 'eslint-plugin-playwright'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import regexp from 'eslint-plugin-regexp'
import sonarjs from 'eslint-plugin-sonarjs'
import testingLibrary from 'eslint-plugin-testing-library'
import unicorn from 'eslint-plugin-unicorn'
import unusedImports from 'eslint-plugin-unused-imports'
import globals from 'globals'
import tseslint from 'typescript-eslint'

// Type-aware parsing shared by every block that runs the type-checked rule sets.
const typeAwareLanguageOptions = {
  ecmaVersion: 2023,
  parserOptions: {
    projectService: true,
    tsconfigRootDir: import.meta.dirname,
  },
}

// House rules layered on top of the recommended presets, applied to all our TS.
const houseRules = {
  // unused-imports owns unused detection so it can auto-remove dead imports on
  // --fix (ts-eslint's rule only reports). Disable the ts-eslint rule to avoid
  // double-reporting.
  '@typescript-eslint/no-unused-vars': 'off',
  'unused-imports/no-unused-imports': 'error',
  'unused-imports/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
  '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
  '@typescript-eslint/no-import-type-side-effects': 'error',
  'no-console': ['error', { allow: ['warn', 'error'] }],
  // Import hygiene — ordering is auto-fixable; duplicate sources are a real smell.
  'import-x/order': [
    'error',
    {
      groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'type'],
      'newlines-between': 'always',
      alphabetize: { order: 'asc', caseInsensitive: true },
    },
  ],
  'import-x/no-duplicates': 'error',
  // TypeScript's own checker covers module resolution and named/default
  // correctness better than import-x — disable the redundant resolver rules.
  'import-x/no-unresolved': 'off',
  'import-x/named': 'off',
  'import-x/namespace': 'off',
  'import-x/default': 'off',
  'import-x/no-named-as-default': 'off',
  'import-x/no-named-as-default-member': 'off',
  // Unicorn relaxations that don't fit a React + Vite app.
  'unicorn/prevent-abbreviations': 'off', // props, params, env, ref… are idiomatic here
  'unicorn/filename-case': ['error', { cases: { camelCase: true, pascalCase: true } }], // App.tsx, main.tsx
  'unicorn/no-null': 'off', // React APIs use null pervasively
  // Perfectionist for non-import sorting only — import-x/order stays the import
  // authority, so perfectionist's import rules are left off.
  'perfectionist/sort-objects': ['error', { type: 'natural' }],
  'perfectionist/sort-object-types': ['error', { type: 'natural' }],
  'perfectionist/sort-interfaces': ['error', { type: 'natural' }],
  'perfectionist/sort-union-types': ['error', { type: 'natural' }],
  'perfectionist/sort-enums': ['error', { type: 'natural' }],
  'perfectionist/sort-jsx-props': ['error', { type: 'natural' }],
}

export default tseslint.config(
  {
    ignores: ['dist', 'node_modules', 'coverage', 'playwright-report', 'test-results'],
  },
  {
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
    },
  },

  // Base — every TS/TSX file in the repo gets type-aware strict + stylistic +
  // import hygiene + unicorn, then our house rules on top.
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.strictTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
      importX.configs['flat/recommended'],
      unicorn.configs['flat/recommended'],
      regexp.configs['flat/recommended'],
      sonarjs.configs.recommended,
    ],
    languageOptions: typeAwareLanguageOptions,
    plugins: {
      'unused-imports': unusedImports,
      perfectionist,
    },
    // Bundled node resolver (handles TS extensions) — no extra resolver dep.
    settings: {
      'import-x/resolver-next': [importX.createNodeResolver({ extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'] })],
    },
    rules: houseRules,
  },

  // Browser app + unit tests — React component rules, hooks, a11y, fast-refresh.
  {
    files: ['src/**/*.{ts,tsx}', 'test/**/*.{ts,tsx}'],
    extends: [
      reactX.configs['recommended-typescript'],
      reactHooks.configs.flat['recommended-latest'],
      jsxA11y.flatConfigs.recommended,
      noUnsanitized.configs.recommended,
    ],
    languageOptions: { globals: globals.browser },
    plugins: { 'react-refresh': reactRefresh },
    rules: {
      'react-refresh/only-export-components': ['error', { allowConstantExport: true }],
    },
  },

  // Unit tests — Vitest correctness + Testing Library best practices.
  {
    files: ['test/**/*.{ts,tsx}'],
    extends: [vitest.configs.recommended, testingLibrary.configs['flat/react']],
  },

  // End-to-end tests + Playwright config — Playwright correctness, Node globals.
  {
    files: ['e2e/**/*.{ts,tsx}', 'playwright.config.ts'],
    extends: [playwright.configs['flat/recommended']],
    languageOptions: { globals: globals.node },
  },

  // Tooling configs that live in a tsconfig (type-aware) — Node globals.
  {
    files: ['vite.config.ts', 'commitlint.config.ts'],
    languageOptions: { globals: globals.node },
  },

  // eslint.config.js itself is in no tsconfig — lint it without type-aware rules.
  {
    files: ['eslint.config.js'],
    extends: [js.configs.recommended, unicorn.configs['flat/recommended']],
    languageOptions: { globals: globals.node },
    rules: {
      'unicorn/prevent-abbreviations': 'off',
    },
  },

  prettier,
)
